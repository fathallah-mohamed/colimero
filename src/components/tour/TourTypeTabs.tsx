interface TourTypeTabsProps {
  tourType: string;
  publicToursCount: number;
  privateToursCount: number;
  onTypeChange: (type: string) => void;
}

export function TourTypeTabs({
  tourType,
  publicToursCount,
  privateToursCount,
  onTypeChange,
}: TourTypeTabsProps) {
  return (
    <div className="grid grid-cols-2 gap-2 bg-gray-100 p-1 rounded-lg">
      <button
        className={`py-2 px-4 rounded-md text-sm font-medium transition-colors ${
          tourType === "public"
            ? "bg-white shadow-sm"
            : "text-gray-600 hover:bg-gray-50"
        }`}
        onClick={() => onTypeChange("public")}
      >
        Tournées Publiques ({publicToursCount})
      </button>
      <button
        className={`py-2 px-4 rounded-md text-sm font-medium transition-colors ${
          tourType === "private"
            ? "bg-white shadow-sm"
            : "text-gray-600 hover:bg-gray-50"
        }`}
        onClick={() => onTypeChange("private")}
      >
        Tournées Privées ({privateToursCount})
      </button>
    </div>
  );
}