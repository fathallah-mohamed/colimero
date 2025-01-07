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
    <div className="grid grid-cols-2 gap-4">
      <button
        className={`p-4 rounded-lg transition-colors ${
          tourType === "public"
            ? "bg-white shadow-md ring-1 ring-primary/10"
            : "bg-gray-50 hover:bg-gray-100"
        }`}
        onClick={() => onTypeChange("public")}
      >
        <div className="space-y-2">
          <div className="font-medium">
            Tournées Publiques ({publicToursCount})
          </div>
          <p className="text-sm text-muted-foreground">
            Accessibles à tous les clients sans approbation préalable
          </p>
        </div>
      </button>
      <button
        className={`p-4 rounded-lg transition-colors ${
          tourType === "private"
            ? "bg-white shadow-md ring-1 ring-primary/10"
            : "bg-gray-50 hover:bg-gray-100"
        }`}
        onClick={() => onTypeChange("private")}
      >
        <div className="space-y-2">
          <div className="font-medium">
            Tournées Privées ({privateToursCount})
          </div>
          <p className="text-sm text-muted-foreground">
            Réservées aux clients approuvés par le transporteur
          </p>
        </div>
      </button>
    </div>
  );
}