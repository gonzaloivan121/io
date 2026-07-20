import { Vector2 } from '@xloxlolex/vector-math';
import { Enemy } from './enemy';
import { Engine } from './engine';
import { Player } from './player';
import { Map } from './map';
import { Point } from './point';
import { Input, KeyCode, GamepadButton } from './input';
import { Color } from './color';
import { Camera } from './camera';
import { Time } from './time';

import { NotInitializedError } from '../../errors';
import { Utilities } from './utilities';
import { Renderer } from './renderer';
import { UI } from './ui';

export class Game {
    private map: Map = this.CreateMap();
    private player: Player = this.CreatePlayer();
    private enemies: Enemy[] = this.CreateEnemies();
    private camera: Camera = this.CreateCamera();
    private points: Point[] = this.CreatePoints();
    private isPaused: boolean = false;

    private eatScoreMargin: number = 100;
    private scoreDecayInterval: number = 1;
    private scoreDecayAmount: number = 1;
    private scoreDecayAccumulator: number = 0;

    public Run(): void {
        Engine.Run(() => {
            this.HandleInput();
            this.Update();
            this.Draw();
        });
    }

    private HandleInput(): void {
        if (
            Input.GetKeyDown(KeyCode.Escape) ||
            Input.GetGamepadButtonDown(GamepadButton.Menu)
        ) {
            this.isPaused = !this.isPaused;
        }

        if ((
            Input.GetKeyDown(KeyCode.R) ||
            Input.GetGamepadButtonDown(GamepadButton.View)) && this.isPaused
        ) {
            this.Restart();
        }
    }

    private Update(): void {
        this.EnsureInitialized();

        if (this.isPaused) {
            return;
        }

        this.UpdateCamera();
        this.UpdateMap();
        this.UpdatePoints();
        this.UpdateEnemies();
        this.UpdatePlayer();

        this.CollectPoints();
        this.HandleEating();
        this.ApplyScoreDecay();
    }

    private UpdateCamera(): void {
        this.camera.Follow(this.player);
        this.camera.Clamp(this.map.position, this.map.scale);
        this.camera.Update();
    }

    private UpdateMap(): void {
        this.map.Update();
    }

    private UpdatePoints(): void {
        for (const point of this.points) {
            point.Update();

            if (point.Expired()) {
                point.Recycle(this.GetRandomPosition());
            }
        }
    }

    private UpdateEnemies(): void {
        this.AssignEnemyTargets();

        for (const enemy of this.enemies) {
            enemy.Update();
            enemy.RestrainInside(this.map);
        }
    }

    private UpdatePlayer(): void {
        this.player.Update();
        this.player.RestrainInside(this.map);
    }

    private ApplyScoreDecay(): void {
        this.scoreDecayAccumulator += Time.DeltaTime;

        if (this.scoreDecayAccumulator < this.scoreDecayInterval) {
            return;
        }

        const ticks = Math.floor(this.scoreDecayAccumulator / this.scoreDecayInterval);
        this.scoreDecayAccumulator -= ticks * this.scoreDecayInterval;

        const decayAmount = ticks * this.scoreDecayAmount;

        this.player.LoseScore(decayAmount);

        for (const enemy of this.enemies) {
            enemy.LoseScore(decayAmount);
        }
    }

    private EnsureInitialized(): void {
        if (!this.map) {
            throw new NotInitializedError(
                'Map is not initialized. Please create a Map before running the game.',
            );
        }

        if (!this.player) {
            throw new NotInitializedError(
                'Player is not initialized. Please create a Player before running the game.',
            );
        }

        if (!this.camera) {
            throw new NotInitializedError(
                'Camera is not initialized. Please create a Camera before running the game.',
            );
        }
    }

    private Draw(): void {
        this.EnsureInitialized();
        this.BeginFrame();

        this.map.Draw();

        for (const point of this.points) {
            point.Draw();
        }

        for (const enemy of this.enemies) {
            enemy.Draw();
        }
        
        this.player.Draw();

        this.EndFrame();

        if (this.isPaused) {
            Renderer.FillRect(Vector2.zero, Renderer.ViewportSize, new Color(0, 0, 0, 0.5).String);
            UI.Panel('Game Paused', 'Press ESC, Menu or Start to resume\nPress R, View or Select to restart', {
                position: Vector2.zero,
                size: new Vector2(400, 200),
                anchor: 'center',
                titleAlign: 'center',
            });
        }

        const leadingEnemyScore = this.GetLeadingEnemyScore();
        const raceStatus = leadingEnemyScore > this.player.scoreValue ? 'Enemies are winning' : 'Player is winning';

        UI.Panel('Score Race', `Player: ${this.player.scoreValue}\nEnemy lead: ${leadingEnemyScore}\n${raceStatus}`, {
            position: new Vector2(20, 20),
            size: new Vector2(240, 125),
            anchor: 'top-left',
            titleAlign: 'center',
        });
    }

    private HandleEating(): void {
        this.ResolvePlayerEnemyEating();
        this.ResolveEnemyEnemyEating();
    }

    private ResolvePlayerEnemyEating(): void {
        for (const enemy of this.enemies) {
            if (!enemy.CollidesWith(this.player)) {
                continue;
            }

            const scoreDelta = this.player.scoreValue - enemy.scoreValue;

            if (Math.abs(scoreDelta) < this.eatScoreMargin) {
                continue;
            }

            if (scoreDelta > 0) {
                const consumedEnemyScore = enemy.scoreValue;
                enemy.Reset(this.GetRandomPosition());

                if (consumedEnemyScore > 0) {
                    this.player.Score(consumedEnemyScore);
                }

                continue;
            }

            const consumedPlayerScore = this.player.scoreValue;
            this.player.Reset(this.GetRandomPosition());

            if (consumedPlayerScore > 0) {
                enemy.Score(consumedPlayerScore);
            }

            break;
        }
    }

    private ResolveEnemyEnemyEating(): void {
        for (let i = 0; i < this.enemies.length; i++) {
            const attacker = this.enemies[i];

            for (let j = i + 1; j < this.enemies.length; j++) {
                const defender = this.enemies[j];

                if (!attacker.CollidesWith(defender)) {
                    continue;
                }

                if (this.HasEatingAdvantage(attacker.scoreValue, defender.scoreValue)) {
                    const consumedScore = defender.scoreValue;
                    defender.Reset(this.GetRandomPosition());

                    if (consumedScore > 0) {
                        attacker.Score(consumedScore);
                    }

                    continue;
                }

                if (this.HasEatingAdvantage(defender.scoreValue, attacker.scoreValue)) {
                    const consumedScore = attacker.scoreValue;
                    attacker.Reset(this.GetRandomPosition());

                    if (consumedScore > 0) {
                        defender.Score(consumedScore);
                    }

                    break;
                }
            }
        }
    }

    private AssignEnemyTargets(): void {
        for (const enemy of this.enemies) {
            let bestTarget: Point | Player | Enemy | null = null;
            let bestScore = Number.NEGATIVE_INFINITY;

            if (this.HasEatingAdvantage(enemy.scoreValue, this.player.scoreValue)) {
                const distance = this.DistanceBetween(enemy.position, this.player.position);
                const desirability = 300 + (this.player.scoreValue * 2) - distance;

                if (desirability > bestScore) {
                    bestScore = desirability;
                    bestTarget = this.player;
                }
            }

            for (const otherEnemy of this.enemies) {
                if (otherEnemy === enemy) {
                    continue;
                }

                if (!this.HasEatingAdvantage(enemy.scoreValue, otherEnemy.scoreValue)) {
                    continue;
                }

                const distance = this.DistanceBetween(enemy.position, otherEnemy.position);
                const desirability = 250 + (otherEnemy.scoreValue * 2) - distance;

                if (desirability > bestScore) {
                    bestScore = desirability;
                    bestTarget = otherEnemy;
                }
            }

            for (const point of this.points) {
                const distance = this.DistanceBetween(enemy.position, point.position);
                const desirability = (point.value * 100) - distance;

                if (desirability > bestScore) {
                    bestScore = desirability;
                    bestTarget = point;
                }
            }

            enemy.target = bestTarget;
        }
    }

    private HasEatingAdvantage(attackerScore: number, defenderScore: number): boolean {
        return (attackerScore - defenderScore) >= this.eatScoreMargin;
    }

    private DistanceBetween(a: Vector2, b: Vector2): number {
        const dx = b.x - a.x;
        const dy = b.y - a.y;

        return Math.hypot(dx, dy);
    }

    private CollectPoints(): void {
        for (const point of this.points) {
            if (point.CollidesWith(this.player)) {
                this.player.Score(point.value);
                point.Recycle(this.GetRandomPosition());
                continue;
            }

            for (const enemy of this.enemies) {
                if (!point.CollidesWith(enemy)) {
                    continue;
                }

                enemy.Score(point.value);
                point.Recycle(this.GetRandomPosition());
                break;
            }
        }
    }

    private GetLeadingEnemyScore(): number {
        let leadingScore = 0;

        for (const enemy of this.enemies) {
            leadingScore = Math.max(leadingScore, enemy.scoreValue);
        }

        return leadingScore;
    }

    private BeginFrame(): void {
        Engine.DrawBackground();

        this.camera.Begin();
    }

    private EndFrame(): void {
        this.camera.End();
    }

    private CreatePlayer(): Player {
        const position: Vector2 = new Vector2(
            Utilities.Random(0, this.map.scale.x),
            Utilities.Random(0, this.map.scale.y),
        );
        const rotation: number = 0;
        const scale: Vector2 = new Vector2(64, 64);
        const speed: number = 1;
        const color: Color = Color.AppleGreen;

        return new Player(position, rotation, scale, speed, color);
    }

    private CreateEnemies(): Enemy[] {
        const enemies: Enemy[] = [];

        for (let i = 0; i < 20; i++) {
            const enemy: Enemy = this.CreateEnemy();
            enemies.push(enemy);
        }

        return enemies;
    }

    private CreateEnemy(): Enemy {
        const position: Vector2 = this.GetRandomPosition();
        const rotation: number = 0;
        const scale: Vector2 = new Vector2(64, 64);
        const speed: number = 1;
        const color: Color = this.CreateEnemyColor();

        return new Enemy(position, rotation, scale, speed, color);
    }

    private CreateMap(): Map {
        const position: Vector2 = new Vector2(Renderer.ViewportCenter.x, Renderer.ViewportCenter.y);
        const rotation: number = 0;
        const scale: Vector2 = new Vector2(1024 * 15, 1024 * 15);
        const speed: number = 0;
        const color: Color = Color.Gray;

        return new Map(position, rotation, scale, speed, color);
    }

    private CreateCamera(): Camera {
        const position: Vector2 = new Vector2(Renderer.ViewportCenter.x, Renderer.ViewportCenter.y);
        const rotation: number = 0;
        const scale: Vector2 = new Vector2(Renderer.ViewportSize.x, Renderer.ViewportSize.y);
        const speed: number = 1;

        return new Camera(position, rotation, scale, speed);
    }

    private CreatePoints(): Point[] {
        const points: Point[] = [];

        for (let i = 0; i < 1000; i++) {
            const point: Point = this.CreatePoint();
            points.push(point);
        }

        return points;
    }

    private CreatePoint(): Point {
        const position: Vector2 = this.GetRandomPosition();
        const rotation: number = 0;
        const scale: Vector2 = new Vector2(16, 16);
        const speed: number = 0;
        const color: Color = Color.Cyan;

        return new Point(position, rotation, scale, speed, color);
    }

    private GetRandomPosition(): Vector2 {
        return new Vector2(
            Renderer.ViewportCenter.x + Utilities.RandomInt(-this.map.scale.x * 0.5, this.map.scale.x * 0.5),
            Renderer.ViewportCenter.y + Utilities.RandomInt(-this.map.scale.y * 0.5, this.map.scale.y * 0.5),
        );
    }

    private Restart(): void {
        this.player.Reset(this.GetRandomPosition());

        for (const enemy of this.enemies) {
            enemy.Reset(this.GetRandomPosition());
            enemy.color = this.CreateEnemyColor();
        }

        for (const point of this.points) {
            point.Recycle(this.GetRandomPosition());
        }

        this.isPaused = false;
    }

    private CreateEnemyColor(): Color {
        const palette: Color[] = Color.All;

        const index = Utilities.RandomInt(0, palette.length - 1);
        return palette[index];
    }
}
