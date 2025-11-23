interface ABCIPTextProps {
  className?: string;
  children?: React.ReactNode;
}

export default function ABCIPText({ className = "", children }: ABCIPTextProps) {
  const text = children?.toString() || "ABCIP";
  
  // Se o texto contém ABCIP, formata com CI em negrito
  if (text.includes("ABCIP")) {
    const parts = text.split("ABCIP");
    return (
      <span className={className}>
        {parts[0]}
        <span>
          AB<span className="font-bold">CI</span>P
        </span>
        {parts[1]}
      </span>
    );
  }
  
  // Se não contém ABCIP, retorna o texto normal
  return <span className={className}>{text}</span>;
}

