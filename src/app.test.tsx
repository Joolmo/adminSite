import React from 'react';
import { render, getByLabelText } from '@testing-library/react';
import { App } from './app';


test('renders requested components', () => {
  const tester = (element: string, container: HTMLElement) => {
    const requestedElement = container.querySelector(element);
    expect(requestedElement).toBeInTheDocument();
  }

  const { container } = render(<App />);
  const requestedElements = ["header", "main", "footer"]
  
  requestedElements.forEach(element => tester(element, container))
});
