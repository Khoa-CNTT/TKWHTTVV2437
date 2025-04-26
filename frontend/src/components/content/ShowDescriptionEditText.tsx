"use client";

import React from 'react';
import DOMPurify from 'dompurify';

interface IProps {
    description: string
}

const ShowDescriptionEditext:React.FC<IProps> = ({description}) => {
    const cleanHTML = DOMPurify.sanitize(description);

    return (
        <div 
            className="text-sm" 
            dangerouslySetInnerHTML={{ __html: cleanHTML }}
        />
    );
}

export default ShowDescriptionEditext;