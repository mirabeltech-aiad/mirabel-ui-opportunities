
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";

const NewFieldForm = ({ newField, setNewField, handleAddField, fieldTypes }) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="field-name" className="text-sm font-medium text-gray-700">Field Name</Label>
        <Input 
          id="field-name"
          placeholder="Enter field name"
          value={newField.name}
          onChange={(e) => setNewField({...newField, name: e.target.value})}
          className="rounded-md border-gray-300 focus:border-ocean-500 focus:ring-ocean-500"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="field-type" className="text-sm font-medium text-gray-700">Field Type</Label>
        <Select 
          value={newField.type}
          onValueChange={(value) => setNewField({...newField, type: value})}
        >
          <SelectTrigger className="rounded-md border-gray-300 focus:border-ocean-500 focus:ring-ocean-500">
            <SelectValue placeholder="Select field type" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 shadow-lg">
            <SelectGroup>
              <SelectLabel className="text-gray-600">Field Types</SelectLabel>
              {fieldTypes.map(type => (
                <SelectItem 
                  key={type.value} 
                  value={type.value}
                  className="hover:bg-ocean-50 focus:bg-ocean-50"
                >
                  {type.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center space-x-3">
        <Checkbox
          id="required-field"
          checked={newField.required}
          onCheckedChange={(checked) => 
            setNewField({...newField, required: checked === true})
          }
          className="rounded-sm border-gray-300 data-[state=checked]:bg-ocean-500 data-[state=checked]:border-ocean-500"
        />
        <Label htmlFor="required-field" className="text-sm font-medium text-gray-700 cursor-pointer">
          Required Field
        </Label>
      </div>
      
      <Button 
        onClick={handleAddField}
        className="w-full bg-ocean-500 text-white hover:bg-ocean-600 border-ocean-500 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
        disabled={!newField.name.trim()}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Custom Field
      </Button>
    </div>
  );
};

export default NewFieldForm;
