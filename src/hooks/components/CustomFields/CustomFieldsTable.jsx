
import { 
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@OpportunityComponents/ui/table";
import { Button } from "@OpportunityComponents/ui/button";
import { Badge } from "@OpportunityComponents/ui/badge";
import { Edit2, ToggleLeft, ToggleRight, Type, Hash, Calendar, Mail, Phone, Link, FileText, CheckSquare, List, Percent, DollarSign, MapPin, Star } from "lucide-react";

const CustomFieldsTable = ({ fields, getTypeLabel }) => {
  // Icon mapping for different field types
  const getTypeIcon = (type) => {
    const iconMap = {
      text: Type,
      textarea: FileText,
      number: Hash,
      email: Mail,
      phone: Phone,
      url: Link,
      date: Calendar,
      time: Calendar,
      datetime: Calendar,
      daterange: Calendar,
      dropdown: List,
      multiselect: List,
      checkbox: CheckSquare,
      radio: CheckSquare,
      currency: DollarSign,
      percent: Percent,
      file: FileText,
      address: MapPin,
      richtext: FileText,
      lookup: List,
      autonumber: Hash,
      formula: Hash,
      rating: Star,
      tags: List,
      geolocation: MapPin,
    };
    
    return iconMap[type] || Type;
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableBody className="bg-white">
          {fields.map((field, index) => {
            const TypeIcon = getTypeIcon(field.type);
            return (
              <TableRow 
                key={field.id} 
                className={`hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                }`}
              >
                <TableCell className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-50 rounded-md flex items-center justify-center">
                      <TypeIcon className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-base">{field.name}</div>
                      <div className="text-sm text-gray-500 mt-0.5">Custom field</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-sm font-medium border-gray-300 text-gray-700 bg-gray-50">
                      {getTypeLabel(field.type)}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="py-4 px-6 text-center">
                  <Badge 
                    variant={field.required ? "blue" : "secondary"} 
                    className={`text-sm font-medium ${
                      field.required 
                        ? 'bg-blue-100 text-blue-800 border-blue-200' 
                        : 'bg-gray-100 text-gray-600 border-gray-200'
                    }`}
                  >
                    {field.required ? "Required" : "Optional"}
                  </Badge>
                </TableCell>
                <TableCell className="py-4 px-6 text-center">
                  <Badge 
                    variant={field.active ? "green" : "secondary"} 
                    className={`text-sm font-medium ${
                      field.active 
                        ? 'bg-green-100 text-green-800 border-green-200' 
                        : 'bg-gray-100 text-gray-600 border-gray-200'
                    }`}
                  >
                    {field.active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right py-4 px-6">
                  <div className="flex items-center gap-2 justify-end">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-9 w-9 p-0 hover:bg-ocean-100 hover:text-ocean-700 rounded-md transition-colors"
                      title="Edit field"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-9 w-9 p-0 hover:bg-gray-100 hover:text-gray-700 rounded-md transition-colors"
                      title={field.active ? "Deactivate field" : "Activate field"}
                    >
                      {field.active ? (
                        <ToggleRight className="h-4 w-4 text-green-600" />
                      ) : (
                        <ToggleLeft className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default CustomFieldsTable;
