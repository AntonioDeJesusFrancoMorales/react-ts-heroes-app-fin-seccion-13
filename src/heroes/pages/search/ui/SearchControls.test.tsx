import { describe, expect, test } from "vitest";
import { fireEvent, screen } from "@testing-library/dom";
import { render } from "@testing-library/react";

import { SearchControls } from "./SearchControls";
import { MemoryRouter } from "react-router";

if (typeof window.ResizeObserver === 'undefined') {
    class ResizeObserver {
        observe() {}
        unobserve() {}
        disconnect() {}
    };
    window.ResizeObserver = ResizeObserver;
};

const renderSearchControls = (pathUrl: string[] = ['/']) => {
    return render(
        <MemoryRouter initialEntries={pathUrl}>
            <SearchControls/>
        </MemoryRouter>
    );
};

describe('SearchControls', () => {
    test('should render the component properly', () => {
        const {container} = renderSearchControls();

        expect(container).toMatchSnapshot();
    });

    test('should set input value when search param is set', () => {
        renderSearchControls(['/?name=superman']);
        const input = screen.getByPlaceholderText('Search heroes, villains, powers, teams...');
        
        expect(input.getAttribute('value')).toBe('superman');
    });

    test('should change input value when input is change and enter is pressed', () => {
        renderSearchControls(['/?name=superman']);
        const input = screen.getByPlaceholderText('Search heroes, villains, powers, teams...');
        expect(input.getAttribute('value')).toBe('superman');

        fireEvent.change(input, {target: {value: 'Batman'}});
        fireEvent.keyDown(input, {key: 'Enter'});

        expect(input.getAttribute('value')).toBe('Batman');
    });

    test('should change the strength parameter when slider changes', () => {
        renderSearchControls(['/?filter=true']);
        const slider = screen.getByRole('slider');
        expect(slider.getAttribute('aria-valuenow')).toBe('5');

        fireEvent.keyDown(slider, {key: 'ArrowRight'});

        expect(slider.getAttribute('aria-valuenow')).toBe('6');
    });

    test('should show accordion when filter paratemer is true', () => {
        renderSearchControls(['/?filter=true']);
        const accordion = screen.getByTestId('filters');
        const accordionState = accordion.querySelector('div');

        expect(accordionState?.getAttribute('data-state')).toBe('open');
    });

    test('should not show accordion when filter paratemer is false', () => {
        renderSearchControls(['/']);
        const accordion = screen.getByTestId('filters');
        const accordionState = accordion.querySelector('div');

        expect(accordionState?.getAttribute('data-state')).toBe('closed');
    });
});