'use client';

import ReactMarkdown from 'react-markdown';

export default function GuideMarkdown({ children }) {
  return (
    <div className="guide-prose">
      <ReactMarkdown
        components={{
          a: ({ href, children: c, ...props }) => {
            const internal = href?.startsWith('/') || href?.startsWith('#');
            return (
              <a
                href={href}
                {...props}
                {...(internal ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
              >
                {c}
              </a>
            );
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
