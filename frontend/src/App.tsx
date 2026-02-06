import React, { useState } from 'react';
import MainLayout from './components/Layout/MainLayout';
import Sidebar from './components/Layout/Sidebar';
import ChatInterface from './components/Chat/ChatInterface';
import ComponentPreview from './components/Preview/ComponentPreview';
import FrameworkTabs from './components/Preview/FrameworkTabs';
import LearningPanel from './components/Learning/LearningPanel';
import ExportOptions from './components/CodeDisplay/ExportOptions';
import { useChat } from './hooks/useChat';
import { useCodeGeneration } from './hooks/useCodeGeneration';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Code, Eye, FileDown } from 'lucide-react';
import './index.css';

function App() {
  const { messages, addMessage, addComponentMessage } = useChat();
  const {
    currentComponent,
    isLoading,
    preferences,
    generate,
    updatePreferences,
    setCurrentComponent,
  } = useCodeGeneration();
  
  const [learningMode, setLearningMode] = useState(false);

  const handleSendMessage = async (message: string) => {
    // Add user message
    addMessage(message, 'user');

    // Generate component
    try {
      await generate(message);
      
      // The component will be set in currentComponent by useCodeGeneration
      // We'll add it to the chat after generation
    } catch (error) {
      addMessage('Sorry, I encountered an error generating the component.', 'assistant');
    }
  };

  // When component changes, add it to chat
  React.useEffect(() => {
    if (currentComponent) {
      addComponentMessage(
        `I've generated the ${currentComponent.name} component for you. You can view the code, preview it, or export it in different formats.`,
        currentComponent
      );
    }
  }, [currentComponent]);

  return (
    <MainLayout>
      <div className="h-full flex">
        {/* Sidebar */}
        <Sidebar
          preferences={preferences}
          onPreferencesChange={updatePreferences}
          learningMode={learningMode}
          onLearningModeToggle={() => setLearningMode(!learningMode)}
        />

        {/* Chat Section */}
        <div className="flex-1 p-4">
          <ChatInterface
            messages={messages}
            isGenerating={isLoading}
            onSendMessage={handleSendMessage}
            onComponentClick={(id) => {
              // Handle component click if needed
              console.log('Component clicked:', id);
            }}
          />
        </div>

        {/* Preview/Code Section */}
        <div className="w-[600px] p-4 border-l">
          <Tabs defaultValue="preview" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="preview">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </TabsTrigger>
              <TabsTrigger value="code">
                <Code className="h-4 w-4 mr-2" />
                Code
              </TabsTrigger>
              <TabsTrigger value="export">
                <FileDown className="h-4 w-4 mr-2" />
                Export
              </TabsTrigger>
            </TabsList>

            <TabsContent value="preview" className="flex-1 mt-4">
              {learningMode ? (
                <LearningPanel component={currentComponent} isOpen={learningMode} />
              ) : (
                <ComponentPreview component={currentComponent} />
              )}
            </TabsContent>

            <TabsContent value="code" className="flex-1 mt-4 overflow-hidden">
              <FrameworkTabs component={currentComponent} />
            </TabsContent>

            <TabsContent value="export" className="flex-1 mt-4">
              <ExportOptions component={currentComponent} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
}

export default App;
