import * as React from "react";

export interface TLProps {
    text: string;
}

export function TL(props: TLProps) {
    return <span>{ props.text }</span>;
}

// Variante für Strings, die nicht im JSX eingefügt werden
export function tl(text: string): string {
    return text;
}