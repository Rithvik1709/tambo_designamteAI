import React from 'react';
import { DesignExplanation as DesignExplanationType } from '@/types';
import { Card, CardContent } from '@/components/ui/card';

interface DesignExplanationProps {
  explanation: DesignExplanationType | null;
}

const DesignExplanation: React.FC<DesignExplanationProps> = ({ explanation }) => {
  if (!explanation) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No explanation available
      </div>
    );
  }

  const sections = [
    { title: 'Structure', content: explanation.structure },
    { title: 'Design Patterns', content: explanation.patterns },
    { title: 'Styling Approach', content: explanation.styling },
    { title: 'Accessibility', content: explanation.accessibility },
    { title: 'Performance', content: explanation.performance },
    { title: 'Improvements', content: explanation.improvements },
  ];

  return (
    <div className="space-y-4">
      {sections.map((section, index) => (
        <Card key={index}>
          <CardContent className="pt-6">
            <h4 className="font-semibold mb-2">{section.title}</h4>
            <p className="text-sm text-muted-foreground">{section.content}</p>
          </CardContent>
        </Card>
      ))}

      {explanation.fullExplanation && (
        <Card>
          <CardContent className="pt-6">
            <h4 className="font-semibold mb-2">Detailed Analysis</h4>
            <div className="text-sm text-muted-foreground whitespace-pre-wrap">
              {explanation.fullExplanation}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DesignExplanation;
