
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CircleCheck } from "lucide-react";

interface InvestmentCompletionPopupProps {
  open: boolean;
  onClose: () => void;
}

const InvestmentCompletionPopup: React.FC<InvestmentCompletionPopupProps> = ({ 
  open, 
  onClose 
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CircleCheck className="h-16 w-16 text-green-500" />
          </div>
          <DialogTitle className="text-xl font-bold">Thank You for Investing!</DialogTitle>
          <DialogDescription className="mt-2">
            Thank you for investing in VAIOT. We will process your transaction, and if verified, 
            we will release your VAIOT tokens to your Crypto-Wallet.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-center">
          <Button onClick={onClose} className="mt-4">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InvestmentCompletionPopup;
