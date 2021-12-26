
export const step = 10;
const I = [[1, 1 + step, 1 + step*2, 1 + step*3],
          [step, step + 1, step + 2, step + 3],
          [1, 1 + step, 1 + step*2, 1 + step*3],
          [step, step + 1, step + 2, step + 3],];
const T = [[1, step, step + 1, step + 2],
          [1, step + 1, step + 2, 1 + step*2],
          [step, step + 1, step + 2, step*2 + 1],
          [1, step, step + 1, step*2 + 1]];
const Z = [[0, 1, step + 1, step + 2],
          [2, step + 1, step + 2, step * 2 + 1],
          [0 , 1, step + 1, step + 2],
          [2, step + 1, step + 2, step*2 + 1]];
const O = [[0, 1, step, step + 1],
          [0, 1, step, step + 1],
          [0, 1, step, step + 1],
          [0, 1, step, step + 1]];
const S = [[1, 2 , step, step + 1],
          [1, step + 1, step + 2, step*2 + 2],
          [1, 2 , step, step + 1],
          [1, step + 1, step + 2, step*2 + 2]];
const J = [[1, step + 1, step*2, step*2 + 1],
          [step, step*2 , step*2 + 1, step*2 + 2],
          [0, 1, step, step*2],
          [step, step + 1, step + 2, step*2 + 2]];
const L = [[0, step, step*2, step*2 + 1],
          [step, step + 1, step + 2, step*2],
          [0, 1, step + 1, step*2 + 1],
          [step + 2, step*2, step*2 + 1, step*2 + 2]];

export const tetrominoes = [I, T, Z, O, S, J, L, I];
