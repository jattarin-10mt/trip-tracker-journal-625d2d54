
import React, { useState } from 'react';
import VehicleForm from '../components/VehicleForm';
import VehicleTable from '../components/VehicleTable';
import FilterBar from '../components/FilterBar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Car } from 'lucide-react';

export interface VehicleRecord {
  id: string;
  name: string;
  startDateTime: Date;
  startLocation: string;
  startMileage: number;
  endDateTime: Date;
  endLocation: string;
  endMileage: number;
  distance: number;
}

const Index = () => {
  const [records, setRecords] = useState<VehicleRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<VehicleRecord[]>([]);
  const [editingRecord, setEditingRecord] = useState<VehicleRecord | null>(null);

  const addRecord = (record: Omit<VehicleRecord, 'id' | 'distance'>) => {
    const newRecord: VehicleRecord = {
      ...record,
      id: Date.now().toString(),
      distance: record.endMileage - record.startMileage,
    };
    const updatedRecords = [...records, newRecord];
    setRecords(updatedRecords);
    setFilteredRecords(updatedRecords);
  };

  const updateRecord = (record: VehicleRecord) => {
    const updatedRecord = {
      ...record,
      distance: record.endMileage - record.startMileage,
    };
    const updatedRecords = records.map(r => 
      r.id === record.id ? updatedRecord : r
    );
    setRecords(updatedRecords);
    setFilteredRecords(updatedRecords);
    setEditingRecord(null);
  };

  const deleteRecord = (id: string) => {
    const updatedRecords = records.filter(r => r.id !== id);
    setRecords(updatedRecords);
    setFilteredRecords(updatedRecords);
  };

  const handleFilter = (startDate?: Date, endDate?: Date) => {
    if (!startDate && !endDate) {
      setFilteredRecords(records);
      return;
    }

    const filtered = records.filter(record => {
      const recordDate = new Date(record.startDateTime);
      if (startDate && endDate) {
        return recordDate >= startDate && recordDate <= endDate;
      }
      if (startDate) {
        return recordDate >= startDate;
      }
      if (endDate) {
        return recordDate <= endDate;
      }
      return true;
    });
    setFilteredRecords(filtered);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-3">
            <Car className="h-8 w-8 text-green-600" />
            <h1 className="text-4xl font-bold text-gray-800">
              ระบบรายงานการใช้รถ
            </h1>
          </div>
          <p className="text-gray-600">
            บันทึกและติดตามการใช้งานรถยนต์อย่างมีประสิทธิภาพ
          </p>
        </div>

        {/* Form Section */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
            <CardTitle className="text-xl">
              {editingRecord ? 'แก้ไขข้อมูลการใช้รถ' : 'บันทึกการใช้รถใหม่'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <VehicleForm
              onSubmit={editingRecord ? updateRecord : addRecord}
              initialData={editingRecord}
              onCancel={() => setEditingRecord(null)}
            />
          </CardContent>
        </Card>

        {/* Filter Section */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
            <CardTitle className="text-xl">ตัวกรองข้อมูล</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <FilterBar onFilter={handleFilter} />
          </CardContent>
        </Card>

        {/* Table Section */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-t-lg">
            <CardTitle className="text-xl">
              รายการการใช้รถ ({filteredRecords.length} รายการ)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <VehicleTable
              records={filteredRecords}
              onEdit={setEditingRecord}
              onDelete={deleteRecord}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
