import { describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';

import App from "./App";

describe("Testing Application", () =>
    test("Checking if word 'Vite' exists in Application page", () => {
        render(<App />)
        expect(screen.getAllByText(/Vite/i)).toBeDefined()
    })
)