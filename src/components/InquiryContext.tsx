"use client";

import { createContext, useCallback, useContext, useMemo, useState } from 'react';

export type InquiryData = {
    imageUrl: string | null;
};

type InquiryContextType = {
    inquiry: InquiryData;
    setInquiry: (data: InquiryData) => void;
    clearInquiry: () => void;
};

const InquiryContext = createContext<InquiryContextType | undefined>(undefined);

export function InquiryProvider({ children }: { children: React.ReactNode }) {
    const [inquiry, setInquiryState] = useState<InquiryData>({ imageUrl: null });

    const setInquiry = useCallback((data: InquiryData) => {
        setInquiryState(data);
    }, []);

    const clearInquiry = useCallback(() => {
        setInquiryState({ imageUrl: null });
    }, []);

    const value = useMemo(() => ({ inquiry, setInquiry, clearInquiry }), [inquiry, setInquiry, clearInquiry]);

    return <InquiryContext.Provider value={value}>{children}</InquiryContext.Provider>;
}

export function useInquiry() {
    const ctx = useContext(InquiryContext);
    if (!ctx) throw new Error('useInquiry must be used within InquiryProvider');
    return ctx;
}


