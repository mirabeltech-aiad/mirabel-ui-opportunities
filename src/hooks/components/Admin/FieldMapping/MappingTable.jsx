
import { Card, CardContent, CardHeader, CardTitle } from "@OpportunityComponents/ui/card";
import { Button } from "@OpportunityComponents/ui/button";
import { Badge } from "@OpportunityComponents/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@OpportunityComponents/ui/table";
import { ScrollArea } from "@OpportunityComponents/ui/scroll-area";
import { Database, ArrowRight } from "lucide-react";

// Extracted for clarity - handles the field mapping table functionality
const MappingTable = ({ 
  localFields, 
  platformFields, 
  mappings, 
  onMappingChange, 
  onSaveMappings 
}) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Field Mappings</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ScrollArea className="h-[300px] w-full">
          <Table>
            <TableHeader>
              <TableRow className="h-8">
                <TableHead className="py-2 text-xs font-medium">Local Field</TableHead>
                <TableHead className="py-2 text-xs font-medium w-16">Type</TableHead>
                <TableHead className="text-center py-2 w-8">
                  <ArrowRight className="h-3 w-3 mx-auto" />
                </TableHead>
                <TableHead className="py-2 text-xs font-medium">Platform Field</TableHead>
                <TableHead className="py-2 text-xs font-medium w-20">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {localFields.map((field) => (
                <TableRow key={field.name} className="h-12">
                  <TableCell className="py-1">
                    <div>
                      <div className="font-medium text-sm">{field.name}</div>
                      <div className="text-xs text-gray-500">{field.description}</div>
                    </div>
                  </TableCell>
                  <TableCell className="py-1">
                    <Badge variant="outline" className="text-xs px-1 py-0">{field.type}</Badge>
                  </TableCell>
                  <TableCell className="text-center py-1">
                    <ArrowRight className="h-3 w-3 text-gray-400" />
                  </TableCell>
                  <TableCell className="py-1">
                    <select
                      value={mappings[field.name] || ""}
                      onChange={(e) => onMappingChange(field.name, e.target.value)}
                      className="w-full p-1 text-sm border rounded bg-white"
                    >
                      <option value="">Select platform field...</option>
                      {platformFields.map((platformField) => (
                        <option key={platformField.name} value={platformField.name}>
                          {platformField.name} ({platformField.type})
                        </option>
                      ))}
                    </select>
                  </TableCell>
                  <TableCell className="py-1">
                    {mappings[field.name] ? (
                      <Badge variant="green" className="text-xs px-2 py-1 inline-flex items-center">
                        Mapped
                      </Badge>
                    ) : (
                      <Badge variant="gray" className="text-xs px-2 py-1 inline-flex items-center">
                        Not Mapped
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
        
        <div className="mt-3 flex justify-end">
          <Button onClick={onSaveMappings} size="sm">
            <Database className="h-3 w-3 mr-2" />
            Save Mappings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MappingTable;
