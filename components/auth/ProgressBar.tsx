type ProgressBarProps = {
    step: number;
  };
  
  const ProgressBar: React.FC<ProgressBarProps> = ({ step }) => {
    return (
      <div className="w-full bg-gray-300 rounded-full h-2 mb-6">
        <div
          className="bg-green-500 rounded-full h-2"
          style={{ width: `${(step / 2) * 100}%` }}
        ></div>
      </div>
    );
  };
  
  export default ProgressBar;
  