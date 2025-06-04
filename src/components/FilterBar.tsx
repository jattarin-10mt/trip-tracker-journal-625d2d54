
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search } from 'lucide-react';

interface FilterBarProps {
  onFilter: (startDate?: Date, endDate?: Date) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ onFilter }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleFilter = () => {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate + 'T23:59:59') : undefined;
    onFilter(start, end);
  };

  const handleClear = () => {
    setStartDate('');
    setEndDate('');
    onFilter();
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        <div>
          <Label htmlFor="startDate" className="text-sm font-medium text-gray-700">
            วันที่เริ่มต้น
          </Label>
          <Input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-1 transition-all duration-200 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <Label htmlFor="endDate" className="text-sm font-medium text-gray-700">
            วันที่สิ้นสุด
          </Label>
          <Input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="mt-1 transition-all duration-200 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleFilter}
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
          >
            <Search className="h-4 w-4 mr-2" />
            ค้นหา
          </Button>
        </div>

        <div>
          <Button
            onClick={handleClear}
            variant="outline"
            className="w-full hover:bg-gray-50 transition-colors duration-200"
          >
            ล้างตัวกรอง
          </Button>
        </div>
      </div>

      {(startDate || endDate) && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-blue-800 text-sm">
            <span className="font-semibold">ตัวกรองที่ใช้:</span>
            {startDate && (
              <span className="ml-2">
                จาก {new Date(startDate).toLocaleDateString('th-TH')}
              </span>
            )}
            {endDate && (
              <span className="ml-2">
                ถึง {new Date(endDate).toLocaleDateString('th-TH')}
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  );
};

export default FilterBar;
