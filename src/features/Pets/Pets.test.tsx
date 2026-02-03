import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import React from 'react';

describe('Teste Inicial', () => {
  it('deve validar se o ambiente de teste está funcionando', () => {
    render(<h1>Pet Manager</h1>);
    expect(screen.getByText('Pet Manager')).toBeInTheDocument();
  });
});