'use client';

import Link from "next/link";

export const HeaderLink = ({ href, text, onClick }: { href?: string; text: string; onClick?: () => void }) => (
    <li className={onClick ? "cursor-pointer" : undefined} onClick={onClick}>
        {href ? (
            <Link href={href} className="text-ct-dark-600">
                {text}
            </Link>
        ) : (
            text
        )}
    </li>
);