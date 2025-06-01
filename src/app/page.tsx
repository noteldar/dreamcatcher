'use client';

import LeftPanel from "@/components/LeftPanel";
import PersonaSelector from "@/components/PersonaSelector";
import RightPanel from "@/components/RightPanel";
import { ParagraphDocument } from "@/types";
import { useEffect, useState } from "react";

// Sample data as fallback
const sampleParagraphs: ParagraphDocument[] = [
  {
    id: "para_20250531_0001",
    persona_name: "Nick Carraway",
    persona_id: "persona_nick_carraway_1925",
    book: "The Great Gatsby",
    paragraph_index: 1,
    paragraph: "In my younger and more vulnerable years my father gave me some advice that I've carried with me ever since. 'Whenever you feel like criticizing anyone,' he told me, 'just remember that all the people in this world haven't had the advantages that you've had.'",
    emotion: "curiosity",
    emotion_level: 6,
    justification: "The opening sets a contemplative, introspective mood with the narrator reflecting on wisdom passed down from his father."
  },
  {
    id: "para_20250531_0002",
    persona_name: "Nick Carraway",
    persona_id: "persona_nick_carraway_1925",
    book: "The Great Gatsby",
    paragraph_index: 2,
    paragraph: "And so with the sunshine and the great bursts of leaves growing on the trees, just as things grow in fast movies, I had that familiar conviction that life was beginning over again with the summer.",
    emotion: "excitement",
    emotion_level: 8,
    justification: "The vivid imagery of nature and rebirth creates a sense of renewal and anticipation for new possibilities."
  },
  {
    id: "para_20250531_0003",
    persona_name: "Nick Carraway",
    persona_id: "persona_nick_carraway_1925",
    book: "The Great Gatsby",
    paragraph_index: 3,
    paragraph: "He had changed since his New Haven years. Now he was a sturdy straw-haired man of thirty with a rather hard mouth and a supercilious manner.",
    emotion: "disappointment",
    emotion_level: 4,
    justification: "The description suggests a negative transformation in character, implying loss of youth and innocence."
  },
  {
    id: "para_20250531_0004",
    persona_name: "Nick Carraway",
    persona_id: "persona_nick_carraway_1925",
    book: "The Great Gatsby",
    paragraph_index: 4,
    paragraph: "I was within and without, simultaneously enchanted and repelled by the inexhaustible variety of life.",
    emotion: "surprise",
    emotion_level: 10,
    justification: "The paradoxical feeling of being both attracted and repulsed creates a sense of overwhelming discovery and confusion."
  },
  {
    id: "para_20250531_0005",
    persona_name: "Nick Carraway",
    persona_id: "persona_nick_carraway_1925",
    book: "The Great Gatsby",
    paragraph_index: 5,
    paragraph: "So we beat on, boats against the current, borne back ceaselessly into the past.",
    emotion: "sadness",
    emotion_level: 7,
    justification: "The famous closing line evokes a melancholic sense of futility and the inescapable weight of history."
  }
];

export default function HomePage() {
  const [paragraphs, setParagraphs] = useState<ParagraphDocument[]>([]);
  const [personas, setPersonas] = useState<string[]>([]);
  const [selectedPersona, setSelectedPersona] = useState<string>('');
  const [isLoadingPersonas, setIsLoadingPersonas] = useState(true);
  const [isLoadingParagraphs, setIsLoadingParagraphs] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch personas on component mount
  useEffect(() => {
    const fetchPersonas = async () => {
      try {
        setIsLoadingPersonas(true);
        const response = await fetch('/api/personas');
        const data = await response.json();

        if (data.success && data.personas.length > 0) {
          setPersonas(data.personas);
          setSelectedPersona(data.personas[0]); // Select first persona
        } else {
          console.warn('No personas found, using sample data');
          setPersonas(['Nick Carraway']);
          setSelectedPersona('Nick Carraway');
          setParagraphs(sampleParagraphs);
          setError('Using sample data - no personas found in database');
        }
      } catch (err) {
        console.warn('Failed to fetch personas, using sample data:', err);
        setPersonas(['Nick Carraway']);
        setSelectedPersona('Nick Carraway');
        setParagraphs(sampleParagraphs);
        setError('Using sample data - failed to connect to database');
      } finally {
        setIsLoadingPersonas(false);
      }
    };

    fetchPersonas();
  }, []);

  // Fetch paragraphs when persona changes
  useEffect(() => {
    if (!selectedPersona) return;

    const fetchParagraphs = async () => {
      try {
        setIsLoadingParagraphs(true);
        setError(null);

        const response = await fetch(`/api/paragraphs?persona_name=${encodeURIComponent(selectedPersona)}&limit=20`);
        const data = await response.json();

        if (data.success && data.paragraphs.length > 0) {
          setParagraphs(data.paragraphs);
        } else {
          console.warn(`No paragraphs found for ${selectedPersona}, using sample data`);
          setParagraphs(sampleParagraphs);
          setError(`No paragraphs found for ${selectedPersona} - using sample data`);
        }
      } catch (err) {
        console.warn('Failed to fetch paragraphs, using sample data:', err);
        setParagraphs(sampleParagraphs);
        setError(`Failed to load paragraphs for ${selectedPersona} - using sample data`);
      } finally {
        setIsLoadingParagraphs(false);
      }
    };

    fetchParagraphs();
  }, [selectedPersona]);

  const handlePersonaChange = (persona: string) => {
    setSelectedPersona(persona);
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 200px)' }}>
      {/* Persona Selector */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '32px'
      }}>
        <PersonaSelector
          personas={personas}
          selectedPersona={selectedPersona}
          onPersonaChange={handlePersonaChange}
          isLoading={isLoadingPersonas}
        />
      </div>

      {error && (
        <div className="warning-message">
          <p>⚠️ {error}</p>
        </div>
      )}

      {/* Loading state for paragraphs */}
      {isLoadingParagraphs && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '40px',
          gap: '16px'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            border: '3px solid rgba(139, 92, 246, 0.3)',
            borderTopColor: '#8b5cf6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <span style={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '18px',
            fontWeight: '500'
          }}>
            Loading {selectedPersona}&apos;s emotional journey...
          </span>
        </div>
      )}

      {/* Main Content Area - Only show when not loading paragraphs */}
      {!isLoadingParagraphs && (
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '32px',
          height: 'calc(100vh - 350px)',
          width: '100%'
        }}>
          <div style={{
            flex: '1 1 50%',
            minWidth: '0'
          }}>
            <LeftPanel paragraphs={paragraphs} />
          </div>
          <div style={{
            flex: '1 1 50%',
            minWidth: '0'
          }}>
            <RightPanel initialParagraphs={paragraphs} />
          </div>
        </div>
      )}

      {/* Footer Info */}
      {!isLoadingParagraphs && paragraphs.length > 0 && (
        <div style={{
          textAlign: 'center',
          fontSize: '15px',
          color: 'rgba(255, 255, 255, 0.7)',
          padding: '24px 0',
          fontWeight: '500'
        }}>
          <p>
            Experiencing <span style={{ color: '#a855f7', fontWeight: '600' }}>{selectedPersona}</span>&apos;s perspective in
            <span style={{ color: '#3b82f6', fontWeight: '600' }}> {paragraphs[0]?.book || 'literature'}</span> through
            <span style={{ color: '#10b981', fontWeight: '600' }}> {paragraphs.length} emotional moments</span>
          </p>
        </div>
      )}
    </div>
  );
}
