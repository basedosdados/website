import {
  VStack,
  Button,
  Text,
  Spinner,
  Box
} from '@chakra-ui/react';
import BodyText from '../../atoms/Text/BodyText';
import useThreads from '../../../hooks/useThreads';

export default function ThreadList({ onSelectThread, currentThreadId, isSidebarOpen }) {
  const { data: threads, isLoading, error } = useThreads();

  if (isLoading) return <Box display="flex" justifyContent="center" mt={4}><Spinner size="sm" /></Box>;
  if (error) return <Text color="red.500" mt={4} fontSize="sm">Erro ao carregar histórico.</Text>;

  return (
    <VStack
      align="stretch"
      spacing="4px"
      marginTop="16px"
      overflowY="auto"
    >
      <BodyText
        typography="small"
        color="currentColor"
        whiteSpace="nowrap"
        height="18px"
        lineHeight="18px"
        width={isSidebarOpen ? "auto" : "0"}
        opacity={isSidebarOpen ? 1 : 0}
        transition="opacity 0.2s ease, transform 0.2s ease, width 0.2s ease"
        transform={isSidebarOpen ? "translateX(0)" : "translateX(4px)"}
      >
        Conversas
      </BodyText>
      {threads?.map((thread) => (
        <BodyText
          key={thread.id}
          onClick={() => onSelectThread && onSelectThread(thread)}
          typography="small"
          color="currentColor"
          whiteSpace="nowrap"
          height="18px"
          lineHeight="18px"
          width={isSidebarOpen ? "auto" : "0"}
          opacity={isSidebarOpen ? 1 : 0}
          transition="opacity 0.2s ease, transform 0.2s ease, width 0.2s ease"
          transform={isSidebarOpen ? "translateX(0)" : "translateX(4px)"}
        >
          {thread.title}
        </BodyText>
      ))}
    </VStack>
  );
};

