import type { PropsWithChildren } from "react";
import { MemoryRouter } from "react-router";
import { describe, expect, test, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import { CustomPagination } from '@/components/custom/CustomPagination';

vi.mock('../ui/button', () => ({
    Button: ({children, ...props}: PropsWithChildren) => <button {...props}>{children}</button>
}));

const renderWithRouter = (component: React.ReactElement, urlPath?: string[]) => {
    return render(
        <MemoryRouter initialEntries={urlPath}>
            {component}
        </MemoryRouter>
    );
};

describe('CustomPagination', () => {
    test('should render component with default values', () => {
        renderWithRouter(<CustomPagination totalPages={5}/>);

        expect(screen.getByText('Anteriores')).toBeDefined();
        expect(screen.getByText('Siguientes')).toBeDefined();

        expect(screen.getByText('1')).toBeDefined();
        expect(screen.getByText('2')).toBeDefined();
        expect(screen.getByText('3')).toBeDefined();
        expect(screen.getByText('4')).toBeDefined();
        expect(screen.getByText('5')).toBeDefined();
    });

    test('should disabled previous button when you are in the first page', () => {
        renderWithRouter(<CustomPagination totalPages={5}/>);
        const prevButton = screen.getByText('Anteriores');

        expect(prevButton.getAttributeNames()).toContain('disabled');
    });

    test('should disabled next button when you are in the last page', () => {
        renderWithRouter(<CustomPagination totalPages={5} />, ['/?page=5']);
        const prevButton = screen.getByText('Siguientes');

        expect(prevButton.getAttributeNames()).toContain('disabled');
    });

    test('should be disabled the number button when you are in the exact page as the number', () => {
        renderWithRouter(<CustomPagination totalPages={5}/>, ['/?page=3']);
        const button3 = screen.getByText('3');
        const button4 = screen.getByText('4');

        expect(button3.getAttribute('variant')).toBe('default');
        expect(button4.getAttribute('variant')).toBe('outline');
    });

    test('should change the page when a number button is pressed', () => {
        renderWithRouter(<CustomPagination totalPages={5}/>, ['/?page=3']);
        const button3 = screen.getByText('3');
        const button4 = screen.getByText('4');

        expect(button3.getAttribute('variant')).toBe('default');
        expect(button4.getAttribute('variant')).toBe('outline');

        fireEvent.click(button4);

        expect(button3.getAttribute('variant')).toBe('outline');
        expect(button4.getAttribute('variant')).toBe('default');
    });
});