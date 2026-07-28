import { createIcon } from "@chakra-ui/icons";

export const MessageBubbleIcon = createIcon({
  displayName: "messageBubble",
  viewBox: "0 0 16 16",
  path: (
    <>
      <path d="M2 1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h9.586a2 2 0 0 1 1.414.586l2 2V2a1 1 0 0 0-1-1zm12-1a2 2 0 0 1 2 2v12.793a.5.5 0 0 1-.854.353l-2.853-2.853a1 1 0 0 0-.707-.293H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2z" fill="currentColor"/>
      <path d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6m0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5" fill="currentColor"/>
    </>
  ),
});

export const MessageBubbleCleanIcon = createIcon({
  displayName: "messageBubbleClean",
  viewBox: "0 0 24 24",
  path: (
    <>
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 2h8a6 6 0 0 1 6 6v4a6 6 0 0 1-6 6h-2.172l-3.414 3.414A1 1 0 0 1 8 20.586V18a6 6 0 0 1-6-6V8a6 6 0 0 1 6-6zm8 2H8a4 4 0 0 0-4 4v4a4 4 0 0 0 4 4h2a1 1 0 0 1 1 1v1.586L13.586 16H16a4 4 0 0 0 4-4V8a4 4 0 0 0-4-4z"
      />
      <circle cx="8.5" cy="10" r="1.25" fill="currentColor" />
      <circle cx="12" cy="10" r="1.25" fill="currentColor" />
      <circle cx="15.5" cy="10" r="1.25" fill="currentColor" />
    </>
  ),
});

export default MessageBubbleIcon;
