import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/features/Opportunity/hooks/use-toast';
import { apiCall } from '@/services/httpClient';
import navigationService from '../services/navigationService';
import * as DialogPrimitive from '@radix-ui/react-dialog';

const JOB_FUNCTIONS_API = '/services/Admin/Masters/MasterData/JobFunction';
const SAVE_JOB_FUNCTIONS_API = '/services/User/Accounts/User/JobFunction/';

const JobFunctionNotification = ({ isOpen, onClose }) => {
  const { toast } = useToast();
  const [jobFunctions, setJobFunctions] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Get user id from navigationService
  const loggedInUser = navigationService.getSessionValue('UserID');

  useEffect(() => {
    if (isOpen) {
      fetchJobFunctions();
      setSelected([]);
      setError(null);
    }
    // eslint-disable-next-line
  }, [isOpen]);

  const fetchJobFunctions = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiCall(JOB_FUNCTIONS_API, 'GET');
      const list = res?.content?.Data?.JobFunction || [];
      setJobFunctions(list);
    } catch (e) {
      setError('Failed to load job functions.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (value) => {
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleSave = async () => {
    if (!selected.length) {
      toast({ title: 'Validation', description: 'Please select at least one job function.', variant: 'destructive' });
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await apiCall(
        SAVE_JOB_FUNCTIONS_API,
        'POST',
        {
          loggedInUser: String(1),
          jobFunctionIDs: selected.join(',')
        }
      );
      toast({ title: 'Success', description: 'Job functions saved successfully.', variant: 'default' });
      onClose();
    } catch (e) {
      setError('Failed to save job functions.');
      toast({ title: 'Error', description: 'Failed to save job functions.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  // Custom DialogContent without the close (X) button
  const ModalContent = React.forwardRef(function ModalContent({ children, ...props }, ref) {
    return (
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          ref={ref}
          className={
            'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg max-h-[400px] translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg'
          }
          onInteractOutside={e => e.preventDefault()}
          onEscapeKeyDown={e => e.preventDefault()}
          {...props}
        >
          {children}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    );
  });

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <ModalContent>
        <div className="flex flex-col h-full">
          <DialogHeader>
            <DialogTitle className="mb-4">Job Function Required</DialogTitle>
          </DialogHeader>
          <div className="mb-2 mt-0 text-sm text-gray-700">
            Please select your job function(s) from this list. This allows the site administrators to tailor communications, training, and notifications to best suit your needs while using this site.<br />
            Thank You.
          </div>
          <div className="flex-1 max-h-48 overflow-y-auto border rounded p-2">
            {jobFunctions.map((job) => (
              <div key={job.Value} className="flex items-center space-x-2 py-1">
                <Checkbox
                  id={`job-${job.Value}`}
                  checked={selected.includes(job.Value)}
                  onCheckedChange={() => handleToggle(job.Value)}
                  disabled={saving}
                />
                <label htmlFor={`job-${job.Value}`} className="text-sm cursor-pointer">
                  {job.Display}
                </label>
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-3">
            <Button onClick={handleSave} disabled={saving || loading || selected.length === 0}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </ModalContent>
    </Dialog>
  );
};

export default JobFunctionNotification; 