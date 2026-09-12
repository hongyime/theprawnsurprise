import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DiceRoller } from '../components/Dice/DiceRoller';
import { Magic8Ball } from '../components/MagicBall/Magic8Ball';

// Test the controls and timers independently of GPU rendering. The real 3D
// canvas remains covered by the desktop/mobile production browser checks.
vi.mock('../components/Dice/Die3D', () => ({
  Die3D: ({ type, value }: { type: number; value: number | null }) =>
    <output data-die={type}>{value ?? 'pending'}</output>,
}));

let host: HTMLDivElement;
let root: Root;
beforeEach(() => {
  vi.useFakeTimers();
  vi.spyOn(Math, 'random').mockReturnValue(0.99);
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  host = document.createElement('div');
  document.body.append(host);
  root = createRoot(host);
});
afterEach(() => {
  act(() => root.unmount());
  host.remove();
  vi.restoreAllMocks();
  vi.useRealTimers();
});
const click = (element: Element | null) => {
  expect(element).not.toBeNull();
  act(() => element!.dispatchEvent(new MouseEvent('click', { bubbles: true })));
};
const selectDie = (name: string) => click([...host.querySelectorAll('button')].find(button => button.textContent === name) ?? null);
const roll = () => click(host.querySelector('[aria-label^="Roll d"]') ?? host.querySelector('.cursor-pointer'));

describe('dice controls', () => {
  it('keeps a new roll active when the abandoned die would have finished', () => {
    act(() => root.render(<DiceRoller />));
    selectDie('d10');
    roll();
    act(() => vi.advanceTimersByTime(400));
    selectDie('d4');
    roll();
    act(() => vi.advanceTimersByTime(400));
    expect(host.textContent).toContain('ROLLING...');
    expect(host.querySelector('output')!.textContent).toBe('pending');
    act(() => vi.advanceTimersByTime(400));
    expect(host.querySelector('output')!.textContent).toBe('4');
    expect(host.textContent).not.toContain('ROLLING...');
  });

  it('does not overwrite the reset result with an outcome from a different die', () => {
    act(() => root.render(<DiceRoller />));
    selectDie('d10');
    roll();
    selectDie('d4');
    act(() => vi.advanceTimersByTime(1000));
    expect(host.querySelector('output')!.getAttribute('data-die')).toBe('4');
    expect(host.querySelector('output')!.textContent).toBe('1');
  });

  it('releases pending roll work when leaving the dice screen', () => {
    act(() => root.render(<DiceRoller />));
    roll();
    act(() => root.render(<p>Another tool</p>));
    expect(vi.getTimerCount()).toBe(0);
  });
});

describe('8-ball controls', () => {
  it('reveals an answer after one shake and permits another question', () => {
    act(() => root.render(<Magic8Ball />));
    const ball = host.querySelector('[aria-label="Ask the 8-ball"]');
    click(ball);
    act(() => vi.advanceTimersByTime(1499));
    expect(host.querySelector('[role="status"]')!.textContent).toBe('CONSULTING THE VOID...');
    act(() => vi.advanceTimersByTime(1));
    expect(host.querySelector('[role="status"]')!.textContent).toBe('Very doubtful');
    click(ball);
    expect(host.querySelector('[role="status"]')!.textContent).toBe('CONSULTING THE VOID...');
  });

  it('releases pending answer work when leaving the 8-ball screen', () => {
    act(() => root.render(<Magic8Ball />));
    click(host.querySelector('[aria-label="Ask the 8-ball"]') ?? host.querySelector('.cursor-pointer'));
    act(() => root.render(<p>Another tool</p>));
    act(() => vi.advanceTimersByTime(100));
    expect(vi.getTimerCount()).toBe(0);
  });
});
