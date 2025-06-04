
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { VehicleRecord } from '../pages/Index';
import { toast } from '@/hooks/use-toast';

interface VehicleFormProps {
  onSubmit: (record: Omit<VehicleRecord, 'id' | 'distance'>) => void;
  initialData?: VehicleRecord | null;
  onCancel?: () => void;
}

const VehicleForm: React.FC<VehicleFormProps> = ({ 
  onSubmit, 
  initialData, 
  onCancel 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    startDateTime: '',
    startLocation: '',
    startMileage: '',
    endDateTime: '',
    endLocation: '',
    endMileage: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        startDateTime: new Date(initialData.startDateTime).toISOString().slice(0, 16),
        startLocation: initialData.startLocation,
        startMileage: initialData.startMileage.toString(),
        endDateTime: new Date(initialData.endDateTime).toISOString().slice(0, 16),
        endLocation: initialData.endLocation,
        endMileage: initialData.endMileage.toString(),
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      toast({
        title: "ข้อผิดพลาด",
        description: "กรุณากรอกชื่อรายการ",
        variant: "destructive",
      });
      return;
    }

    const startMileage = parseFloat(formData.startMileage);
    const endMileage = parseFloat(formData.endMileage);

    if (isNaN(startMileage) || isNaN(endMileage)) {
      toast({
        title: "ข้อผิดพลาด",
        description: "กรุณากรอกเลขไมล์เป็นตัวเลข",
        variant: "destructive",
      });
      return;
    }

    if (endMileage < startMileage) {
      toast({
        title: "ข้อผิดพลาด",
        description: "เลขไมล์ปลายทางต้องมากกว่าเลขไมล์เริ่มต้น",
        variant: "destructive",
      });
      return;
    }

    const startDateTime = new Date(formData.startDateTime);
    const endDateTime = new Date(formData.endDateTime);

    if (endDateTime < startDateTime) {
      toast({
        title: "ข้อผิดพลาด",
        description: "เวลาถึงปลายทางต้องหลังจากเวลาเริ่มต้น",
        variant: "destructive",
      });
      return;
    }

    const record = {
      name: formData.name.trim(),
      startDateTime,
      startLocation: formData.startLocation.trim(),
      startMileage,
      endDateTime,
      endLocation: formData.endLocation.trim(),
      endMileage,
    };

    if (initialData) {
      onSubmit({ ...record, id: initialData.id } as any);
    } else {
      onSubmit(record);
    }

    // Reset form if not editing
    if (!initialData) {
      setFormData({
        name: '',
        startDateTime: '',
        startLocation: '',
        startMileage: '',
        endDateTime: '',
        endLocation: '',
        endMileage: '',
      });
    }

    toast({
      title: "สำเร็จ",
      description: initialData ? "แก้ไขข้อมูลเรียบร้อย" : "บันทึกข้อมูลเรียบร้อย",
    });
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      startDateTime: '',
      startLocation: '',
      startMileage: '',
      endDateTime: '',
      endLocation: '',
      endMileage: '',
    });
    if (onCancel) onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ชื่อรายการ */}
        <div className="md:col-span-2">
          <Label htmlFor="name" className="text-sm font-medium text-gray-700">
            ชื่อรายการ *
          </Label>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="เช่น เดินทางไปงานประชุม"
            className="mt-1 transition-all duration-200 focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        {/* จุดเริ่มต้น */}
        <Card className="p-4 bg-green-50 border-green-200">
          <h3 className="font-semibold text-green-800 mb-4 flex items-center">
            <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
            จุดเริ่มต้น
          </h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="startDateTime" className="text-sm font-medium text-gray-700">
                วันและเวลาเริ่มต้น *
              </Label>
              <Input
                id="startDateTime"
                type="datetime-local"
                value={formData.startDateTime}
                onChange={(e) => setFormData({ ...formData, startDateTime: e.target.value })}
                className="mt-1 transition-all duration-200 focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <Label htmlFor="startLocation" className="text-sm font-medium text-gray-700">
                สถานที่เริ่มต้น *
              </Label>
              <Input
                id="startLocation"
                type="text"
                value={formData.startLocation}
                onChange={(e) => setFormData({ ...formData, startLocation: e.target.value })}
                placeholder="เช่น บ้าน, สำนักงาน"
                className="mt-1 transition-all duration-200 focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <Label htmlFor="startMileage" className="text-sm font-medium text-gray-700">
                เลขไมล์เริ่มต้น (กม.) *
              </Label>
              <Input
                id="startMileage"
                type="number"
                step="0.1"
                value={formData.startMileage}
                onChange={(e) => setFormData({ ...formData, startMileage: e.target.value })}
                placeholder="0.0"
                className="mt-1 transition-all duration-200 focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
          </div>
        </Card>

        {/* จุดปลายทาง */}
        <Card className="p-4 bg-red-50 border-red-200">
          <h3 className="font-semibold text-red-800 mb-4 flex items-center">
            <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
            จุดปลายทาง
          </h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="endDateTime" className="text-sm font-medium text-gray-700">
                วันและเวลาถึงปลายทาง *
              </Label>
              <Input
                id="endDateTime"
                type="datetime-local"
                value={formData.endDateTime}
                onChange={(e) => setFormData({ ...formData, endDateTime: e.target.value })}
                className="mt-1 transition-all duration-200 focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
            <div>
              <Label htmlFor="endLocation" className="text-sm font-medium text-gray-700">
                สถานที่ปลายทาง *
              </Label>
              <Input
                id="endLocation"
                type="text"
                value={formData.endLocation}
                onChange={(e) => setFormData({ ...formData, endLocation: e.target.value })}
                placeholder="เช่น ห้างสรรพสินค้า, ลูกค้า"
                className="mt-1 transition-all duration-200 focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
            <div>
              <Label htmlFor="endMileage" className="text-sm font-medium text-gray-700">
                เลขไมล์ปลายทาง (กม.) *
              </Label>
              <Input
                id="endMileage"
                type="number"
                step="0.1"
                value={formData.endMileage}
                onChange={(e) => setFormData({ ...formData, endMileage: e.target.value })}
                placeholder="0.0"
                className="mt-1 transition-all duration-200 focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Distance Preview */}
      {formData.startMileage && formData.endMileage && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="text-center">
            <p className="text-blue-800 font-semibold">
              ระยะทางที่คำนวณได้: {' '}
              <span className="text-2xl font-bold">
                {(parseFloat(formData.endMileage) - parseFloat(formData.startMileage)).toFixed(1)} กม.
              </span>
            </p>
          </div>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 justify-end">
        {initialData && onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="px-6 py-2 hover:bg-gray-50 transition-colors duration-200"
          >
            ยกเลิก
          </Button>
        )}
        <Button
          type="submit"
          className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 transition-all duration-200 transform hover:scale-105"
        >
          {initialData ? 'บันทึกการแก้ไข' : 'บันทึกข้อมูล'}
        </Button>
      </div>
    </form>
  );
};

export default VehicleForm;
