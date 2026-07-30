import { InvalidArgumentError } from '../../errors';
import { SessionService } from './session.service';

describe('SessionService', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('stores and retrieves values', () => {
        SessionService.Set('points', '42');

        expect(SessionService.Get('points')).toBe('42');
    });

    it('clears only the provided key', () => {
        SessionService.Set('a', '1');
        SessionService.Set('b', '2');

        SessionService.Clear('a');

        expect(SessionService.Get('a')).toBeNull();
        expect(SessionService.Get('b')).toBe('2');
    });

    it('clears all keys when no key is provided', () => {
        SessionService.Set('a', '1');
        SessionService.Set('b', '2');

        SessionService.Clear();

        expect(SessionService.length).toBe(0);
    });

    it('reports key existence', () => {
        SessionService.Set('a', '1');

        expect(SessionService.Exists('a')).toBeTruthy();
        expect(SessionService.Exists('missing')).toBeFalsy();
    });

    it('compares stored values', () => {
        SessionService.Set('difficulty', 'hard');

        expect(SessionService.Is('difficulty', 'hard')).toBeTruthy();
        expect(SessionService.Is('difficulty', 'easy')).toBeFalsy();
    });

    it('returns all keys', () => {
        SessionService.Set('k1', 'v1');
        SessionService.Set('k2', 'v2');

        const keys = SessionService.Keys();

        expect(keys.length).toBe(2);
        expect(keys).toContain('k1');
        expect(keys).toContain('k2');
    });

    it('returns key by index', () => {
        SessionService.Set('first', '1');

        expect(SessionService.Key(0)).toBe('first');
    });

    it('throws on invalid key index', () => {
        expect(() => SessionService.Key(-1)).toThrow(InvalidArgumentError);
        expect(() => SessionService.Key(0)).toThrow(InvalidArgumentError);
    });

    it('tracks storage length', () => {
        expect(SessionService.length).toBe(0);

        SessionService.Set('one', '1');
        SessionService.Set('two', '2');

        expect(SessionService.length).toBe(2);
    });

    it('throws when Get receives an empty key', () => {
        expect(() => SessionService.Get('')).toThrow(InvalidArgumentError);
        expect(() => SessionService.Get('   ')).toThrow(InvalidArgumentError);
    });

    it('throws when Set receives empty key or value', () => {
        expect(() => SessionService.Set('', '1')).toThrow(InvalidArgumentError);
        expect(() => SessionService.Set('k', '')).toThrow(InvalidArgumentError);
    });

    it('throws when Exists receives an empty key', () => {
        expect(() => SessionService.Exists('')).toThrow(InvalidArgumentError);
    });

    it('throws when Is receives invalid arguments', () => {
        expect(() => SessionService.Is('', 'v')).toThrow(InvalidArgumentError);
        expect(() => SessionService.Is('k', '')).toThrow(InvalidArgumentError);
    });
});
