import { Vector2 } from "@xloxlolex/vector-math";

import { Application } from "./interfaces/application.interface";

import { Color } from "../engine/color";
import { Renderer } from "../engine/renderer";
import { Time } from "../engine/time";
import { Transform } from "../engine/transform";

import { Log } from "../log/log";
import { UI } from "../ui/ui";

interface Heart {
    transform: Transform;
    minSize: Vector2;
    maxSize: Vector2;
    speed: number;
}

export class WelcomeApplication implements Application {
    private heart: Heart = {
        transform: new Transform(),
        minSize: Vector2.one,
        maxSize: new Vector2(2, 2),
        speed: 0.001,
    };

    Initialize(): void {
        Log.Info('WelcomeApplication.Initialize() - Initializing WelcomeApplication...');
    }

    Shutdown(): void {
        Log.Info('WelcomeApplication.Shutdown() - Shutting down WelcomeApplication...');
    }

    Restart(): void {
        Log.Info('WelcomeApplication.Restart() - Restarting WelcomeApplication...');
    }

    Update(): void {
        this.heart.transform.scale = Vector2.Lerp(
            this.heart.minSize,
            this.heart.maxSize,
            (Math.sin(Time.Time * this.heart.speed) + 1) / 2,
        );
        this.heart.transform.rotation = Time.Time * this.heart.speed;
    }

    Draw(): void {
        this.DrawBackground();
        this.DrawWelcomeText();
        this.DrawHeart();
    }

    private DrawBackground(): void {
        Renderer.Clear();
        Renderer.FillRect(Vector2.zero, Renderer.ViewportSize, Color.Black.String);
    }

    private DrawWelcomeText(): void {
        UI.Label('Welcome to the IO starting Application!', {
            position: new Vector2(0, 50),
            fillStyle: Color.White.String,
            strokeStyle: Color.White.Darker.String,
            font: '32px Arial',
            textAlign: 'center',
            textBaseline: 'top',
            anchor: 'top-center',
        });
    }

    private DrawHeart(): void {
        Renderer.Save();

        Renderer.Translate(Renderer.ViewportCenter);
        Renderer.Rotate(this.heart.transform.rotation);
        Renderer.Scale(this.heart.transform.scale);
        Renderer.Translate(Vector2.Multiply(this.heart.transform.position, -1));

        Renderer.DrawText('❤️', Vector2.zero, {
            textAlign: 'center',
            textBaseline: 'middle',
            font: '256px Arial',
        });

        Renderer.Restore();
    }
}