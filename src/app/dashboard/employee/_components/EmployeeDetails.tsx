"use client";

import React, { useState } from "react";
import { Employee } from "@/types/employees.type";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import EmployeeBankDetails from "./EmployeeBankDetails";
import EmployeeTaxDetails from "./EmployeeTaxDetails";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import PageHeader from "@/components/common/PageHeader";

const EmployeeDetails = ({
  employee,
  id,
}: {
  employee: Employee | undefined;
  id: string | undefined;
}) => {
  const [activeTab, setActiveTab] = useState("bank");
  const [isDirty, setIsDirty] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [pendingTab, setPendingTab] = useState<string | null>(null);

  // Handle tab switch with dialog confirmation
  const handleTabChange = (newTab: string) => {
    if (isDirty) {
      setPendingTab(newTab);
      setShowDialog(true);
    } else {
      setActiveTab(newTab);
    }
  };

  // Proceed with tab change after confirmation
  const confirmTabChange = () => {
    if (pendingTab) {
      setActiveTab(pendingTab);
      setIsDirty(false);
      setShowDialog(false);
    }
  };

  return (
    <section>
      <PageHeader
        title="Employee Details"
        description="View and edit employee details here. You can update bank and tax details of the employee."
      />
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="mb-4">
          <TabsTrigger value="bank">Bank details</TabsTrigger>
          <TabsTrigger value="tax">Tax details</TabsTrigger>
        </TabsList>

        <TabsContent value="bank">
          <EmployeeBankDetails
            employee={employee}
            id={id}
            setIsDirty={setIsDirty}
          />
        </TabsContent>
        <TabsContent value="tax">
          <EmployeeTaxDetails
            employee={employee}
            id={id}
            setIsDirty={setIsDirty}
          />
        </TabsContent>
      </Tabs>

      {/* AlertDialog for Unsaved Changes */}
      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Are you sure you want to switch tabs?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDialog(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmTabChange}>
              Switch Tab
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
};

export default EmployeeDetails;
