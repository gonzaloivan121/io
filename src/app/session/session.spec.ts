import { InvalidArgumentError } from '../errors';
import { Session } from './session';

describe('Session', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('stores and retrieves values', () => {
        Session.Set('points', '42');

        expect(Session.Get('points')).toBe('42');
    });

    it('clears only the provided key', () => {
        Session.Set('a', '1');
        Session.Set('b', '2');

        Session.Clear('a');

        expect(Session.Get('a')).toBeNull();
        expect(Session.Get('b')).toBe('2');
    });

    it('clears all keys when no key is provided', () => {
        Session.Set('a', '1');
        Session.Set('b', '2');

        Session.Clear();

        expect(Session.length).toBe(0);
    });

    it('reports key existence', () => {
        Session.Set('a', '1');

        expect(Session.Exists('a')).toBeTruthy();
        expect(Session.Exists('missing')).toBeFalsy();
    });

    it('compares stored values', () => {
        Session.Set('difficulty', 'hard');

        expect(Session.Is('difficulty', 'hard')).toBeTruthy();
        expect(Session.Is('difficulty', 'easy')).toBeFalsy();
    });

    it('returns all keys', () => {
        Session.Set('k1', 'v1');
        Session.Set('k2', 'v2');

        const keys = Session.Keys();

        expect(keys.length).toBe(2);
        expect(keys).toContain('k1');
        expect(keys).toContain('k2');
    });

    it('returns key by index', () => {
        Session.Set('first', '1');

        expect(Session.Key(0)).toBe('first');
    });

    it('throws on invalid key index', () => {
        expect(() => Session.Key(-1)).toThrow(InvalidArgumentError);
        expect(() => Session.Key(0)).toThrow(InvalidArgumentError);
    });

    it('tracks storage length', () => {
        expect(Session.length).toBe(0);

        Session.Set('one', '1');
        Session.Set('two', '2');

        expect(Session.length).toBe(2);
    });

    it('throws when Get receives an empty key', () => {
        expect(() => Session.Get('')).toThrow(InvalidArgumentError);
        expect(() => Session.Get('   ')).toThrow(InvalidArgumentError);
    });

    it('throws when Set receives empty key or value', () => {
        expect(() => Session.Set('', '1')).toThrow(InvalidArgumentError);
        expect(() => Session.Set('k', '')).toThrow(InvalidArgumentError);
    });

    it('throws when Exists receives an empty key', () => {
        expect(() => Session.Exists('')).toThrow(InvalidArgumentError);
    });

    it('throws when Is receives invalid arguments', () => {
        expect(() => Session.Is('', 'v')).toThrow(InvalidArgumentError);
        expect(() => Session.Is('k', '')).toThrow(InvalidArgumentError);
    });
});
