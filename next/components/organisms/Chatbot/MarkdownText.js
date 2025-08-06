import React from 'react';
import { Box, Text, Code, Link, UnorderedList, OrderedList, ListItem } from '@chakra-ui/react';

const MarkdownText = ({ children, typography = "small", color = "#252A32", ...props }) => {
  if (!children) return null;

  const parseMarkdown = (text) => {
    const lines = text.split('\n');
    const elements = [];
    let currentList = null;
    let currentListType = null;
    let inCodeBlock = false;
    let codeBlockContent = [];
    let codeBlockLang = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Handle code blocks
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          // End code block
          elements.push(
            <Code
              key={`code-block-${i}`}
              display="block"
              whiteSpace="pre-wrap"
              fontSize="sm"
              backgroundColor="#2D3748"
              color="white"
              padding={3}
              borderRadius="6px"
              overflowX="auto"
              marginY={2}
            >
              {codeBlockContent.join('\n')}
            </Code>
          );
          inCodeBlock = false;
          codeBlockContent = [];
          codeBlockLang = '';
        } else {
          // Start code block
          inCodeBlock = true;
          codeBlockLang = line.slice(3).trim();
        }
        continue;
      }

      if (inCodeBlock) {
        codeBlockContent.push(line);
        continue;
      }

      // Handle lists
      const unorderedMatch = line.match(/^[\s]*[-*+]\s+(.+)$/);
      const orderedMatch = line.match(/^[\s]*\d+\.\s+(.+)$/);

      if (unorderedMatch || orderedMatch) {
        const listContent = unorderedMatch ? unorderedMatch[1] : orderedMatch[1];
        const listType = unorderedMatch ? 'ul' : 'ol';

        if (currentListType !== listType) {
          // End previous list if different type
          if (currentList) {
            elements.push(currentList);
          }
          // Start new list
          currentList = listType === 'ul' ? 
            <UnorderedList key={`list-${i}`} marginY={2}>
              <ListItem>{parseInlineMarkdown(listContent)}</ListItem>
            </UnorderedList> :
            <OrderedList key={`list-${i}`} marginY={2}>
              <ListItem>{parseInlineMarkdown(listContent)}</ListItem>
            </OrderedList>;
          currentListType = listType;
        } else {
          // Add to current list
          const listItems = currentList.props.children;
          currentList = React.cloneElement(currentList, {}, [
            ...Array.isArray(listItems) ? listItems : [listItems],
            <ListItem key={`item-${i}`}>{parseInlineMarkdown(listContent)}</ListItem>
          ]);
        }
      } else {
        // End current list if not a list item
        if (currentList) {
          elements.push(currentList);
          currentList = null;
          currentListType = null;
        }

        // Handle regular text
        if (line.trim()) {
          elements.push(
            <Text key={`text-${i}`} marginY={1}>
              {parseInlineMarkdown(line)}
            </Text>
          );
        } else {
          // Empty line - add spacing
          elements.push(<Box key={`space-${i}`} height="0.5em" />);
        }
      }
    }

    // Add final list if exists
    if (currentList) {
      elements.push(currentList);
    }

    return elements;
  };

  const parseInlineMarkdown = (text) => {
    const parts = [];
    let currentText = text;
    let key = 0;

    // Handle inline code
    currentText = currentText.replace(/`([^`]+)`/g, (match, code) => {
      const placeholder = `__CODE_${key}__`;
      parts.push({
        type: 'code',
        content: code,
        key: key,
        placeholder
      });
      key++;
      return placeholder;
    });

    // Handle bold
    currentText = currentText.replace(/\*\*([^*]+)\*\*/g, (match, bold) => {
      const placeholder = `__BOLD_${key}__`;
      parts.push({
        type: 'bold',
        content: bold,
        key: key,
        placeholder
      });
      key++;
      return placeholder;
    });

    // Handle italic
    currentText = currentText.replace(/\*([^*]+)\*/g, (match, italic) => {
      const placeholder = `__ITALIC_${key}__`;
      parts.push({
        type: 'italic',
        content: italic,
        key: key,
        placeholder
      });
      key++;
      return placeholder;
    });

    // Handle links
    currentText = currentText.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, linkText, url) => {
      const placeholder = `__LINK_${key}__`;
      parts.push({
        type: 'link',
        content: linkText,
        url: url,
        key: key,
        placeholder
      });
      key++;
      return placeholder;
    });

    // Split by placeholders and reconstruct
    const segments = currentText.split(/(__\w+_\d+__)/);
    
    return segments.map((segment, index) => {
      const part = parts.find(p => p.placeholder === segment);
      
      if (part) {
        switch (part.type) {
          case 'code':
            return (
              <Code 
                key={`inline-${part.key}`}
                fontSize="sm"
                backgroundColor="#F7FAFC"
                color="#2D3748"
                padding="1px 4px"
                borderRadius="3px"
              >
                {part.content}
              </Code>
            );
          case 'bold':
            return <Text as="strong" key={`bold-${part.key}`}>{part.content}</Text>;
          case 'italic':
            return <Text as="em" key={`italic-${part.key}`}>{part.content}</Text>;
          case 'link':
            return (
              <Link 
                key={`link-${part.key}`}
                href={part.url}
                color="blue.500"
                textDecoration="underline"
                isExternal
              >
                {part.content}
              </Link>
            );
          default:
            return segment;
        }
      }
      
      return segment || '';
    });
  };

  return (
    <Box fontSize={typography === 'small' ? 'sm' : 'md'} color={color} {...props}>
      {parseMarkdown(children)}
    </Box>
  );
};

export default MarkdownText; 