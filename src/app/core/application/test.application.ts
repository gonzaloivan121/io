import { Vector2 } from "@xloxlolex/vector-math";

import { Application } from "./interfaces/application.interface";

import { Color } from "../engine/color";
import { Renderer } from "../engine/renderer";
import { Time } from "../engine/time";

import { Log } from "../log/log";

interface Heart {
    position: Vector2;
    rotation: number;
    size: Vector2;
    minSize: Vector2;
    maxSize: Vector2;
    speed: number;
}

export class TestApplication implements Application {
    private heart: Heart = {
        position: Renderer.ViewportCenter,
        rotation: 0,
        size: new Vector2(1, 1),
        minSize: new Vector2(1, 1),
        maxSize: new Vector2(2, 2),
        speed: 0.001,
    };

    Initialize(): void {
        Log.Info('TestApplication.Initialize() - Initializing TestApplication...');
    }

    Shutdown(): void {
        Log.Info('TestApplication.Shutdown() - Shutting down TestApplication...');
    }

    Restart(): void {
        Log.Info('TestApplication.Restart() - Restarting TestApplication...');
    }

    Update(): void {
        this.heart.size = Vector2.Lerp(this.heart.minSize, this.heart.maxSize, (Math.sin(Time.Time * this.heart.speed) + 1) / 2);
        this.heart.rotation = Time.Time * this.heart.speed;
    }

    Draw(): void {
        this.DrawBackground();
        this.DrawHeart();
    }

    private DrawBackground(): void {
        Renderer.Clear();
        Renderer.FillRect(Vector2.zero, Renderer.ViewportSize, Color.Black.String);
    }

    private DrawHeart(): void {
        Renderer.Save();

        Renderer.Translate(this.heart.position);
        Renderer.Rotate(this.heart.rotation);
        Renderer.Scale(this.heart.size);

        Renderer.DrawText('❤️', Vector2.zero, {
            textAlign: 'center',
            textBaseline: 'middle',
            font: '256px Arial'
        });
        
        Renderer.Restore();

    }
}