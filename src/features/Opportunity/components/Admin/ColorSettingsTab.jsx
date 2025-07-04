
import ColorCustomizer from "@/components/ui/ColorCustomizer";

const ColorSettingsTab = () => {
  return (
    <div className="p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold">Dashboard Color Settings</h2>
        <p className="text-gray-500">Customize the appearance of dashboard tiles and text colors</p>
      </div>
      <ColorCustomizer />
    </div>
  );
};

export default ColorSettingsTab;
