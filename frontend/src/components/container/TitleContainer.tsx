
interface TitleContainerProps {
    title: string;
    description?: string;
  }

const TitleContainer = ( {title, description}:TitleContainerProps) => {
  return (
    <div>
        <h4 className="text-2xl font-bold text-gray-800">{title}</h4>
        <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}

export default TitleContainer;