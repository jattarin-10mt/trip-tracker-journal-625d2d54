
import React from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import { VehicleRecord } from '../pages/Index';
import { toast } from '@/hooks/use-toast';

interface VehicleTableProps {
  records: VehicleRecord[];
  onEdit: (record: VehicleRecord) => void;
  onDelete: (id: string) => void;
}

const VehicleTable: React.FC<VehicleTableProps> = ({ records, onEdit, onDelete }) => {
  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('th-TH', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  const formatNumber = (num: number) => {
    return num.toFixed(1);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`คุณต้องการลบรายการ "${name}" หรือไม่?`)) {
      onDelete(id);
      toast({
        title: "ลบสำเร็จ",
        description: `ลบรายการ "${name}" เรียบร้อยแล้ว`,
      });
    }
  };

  const getTotalDistance = () => {
    return records.reduce((total, record) => total + record.distance, 0);
  };

  if (records.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">🚗</div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">
          ยังไม่มีข้อมูลการใช้รถ
        </h3>
        <p className="text-gray-500">
          เริ่มบันทึกการเดินทางของคุณเพื่อติดตามการใช้งานรถ
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-blue-600 font-semibold">จำนวนรายการทั้งหมด</p>
            <p className="text-2xl font-bold text-blue-800">{records.length}</p>
          </div>
          <div>
            <p className="text-blue-600 font-semibold">ระยะทางรวม</p>
            <p className="text-2xl font-bold text-blue-800">{formatNumber(getTotalDistance())} กม.</p>
          </div>
          <div>
            <p className="text-blue-600 font-semibold">ระยะทางเฉลี่ย</p>
            <p className="text-2xl font-bold text-blue-800">
              {formatNumber(getTotalDistance() / records.length)} กม.
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="text-center font-semibold">ชื่อรายการ</TableHead>
                <TableHead className="text-center font-semibold">เวลาเริ่มต้น</TableHead>
                <TableHead className="text-center font-semibold">สถานที่เริ่มต้น</TableHead>
                <TableHead className="text-center font-semibold">ไมล์เริ่มต้น</TableHead>
                <TableHead className="text-center font-semibold">เวลาถึงปลายทาง</TableHead>
                <TableHead className="text-center font-semibold">สถานที่ปลายทาง</TableHead>
                <TableHead className="text-center font-semibold">ไมล์ปลายทาง</TableHead>
                <TableHead className="text-center font-semibold">ระยะทาง</TableHead>
                <TableHead className="text-center font-semibold">จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((record, index) => (
                <TableRow 
                  key={record.id} 
                  className={`hover:bg-gray-50 transition-colors duration-200 ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                  }`}
                >
                  <TableCell className="font-medium text-center">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {record.name}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center text-sm">
                    {formatDateTime(record.startDateTime)}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      {record.startLocation}
                    </span>
                  </TableCell>
                  <TableCell className="text-center font-mono">
                    {formatNumber(record.startMileage)} กม.
                  </TableCell>
                  <TableCell className="text-center text-sm">
                    {formatDateTime(record.endDateTime)}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex items-center">
                      <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                      {record.endLocation}
                    </span>
                  </TableCell>
                  <TableCell className="text-center font-mono">
                    {formatNumber(record.endMileage)} กม.
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge 
                      variant="secondary" 
                      className="bg-green-100 text-green-800 border-green-200 font-bold"
                    >
                      {formatNumber(record.distance)} กม.
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex gap-2 justify-center">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEdit(record)}
                        className="hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(record.id, record.name)}
                        className="hover:bg-red-50 hover:border-red-300 text-red-600 transition-all duration-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default VehicleTable;
