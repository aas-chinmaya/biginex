"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BusinessList from "@/modules/business/components/BusinessList";
import AddBranchModal from "@/modules/business/components/AddBranchModal";
import { BranchFormData } from "@/modules/business/components/BranchForm";
import { Branch } from "@/modules/business/types";
import {
  deleteBranch,
  deleteBusiness,
  fetchBusinesses,
  createBranch,
  selectBusinessRecords,
  selectBusinessStatus,
  selectBusinesses,
  updateBranch,
} from "@/modules/business/store/businessSlice";
import { Container } from "@/components/common";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

const toBranchFormData = (branch: Branch): BranchFormData => ({
  branchName: branch.name,
  branchCode: branch.code,
  branchType: "Branch",
  status: branch.status,
  address1: branch.address,
  address2: "",
  country: branch.country || "India",
  state: branch.state,
  city: branch.city,
  pincode: "",
  manager: branch.manager,
  phone: branch.phone,
  mobile: "",
  email: branch.email,
  website: "",
  gstin: "",
  pan: "",
  licence: "",
  openingDate: "",
  notes: "",
});

export default function BusinessPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const businesses = useAppSelector(selectBusinesses);
  const rawBusinesses = useAppSelector(selectBusinessRecords);
  const status = useAppSelector(selectBusinessStatus);
  const [branchModalOpen, setBranchModalOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(null);

  useEffect(() => {
    void dispatch(fetchBusinesses());
  }, [dispatch]);

  const refresh = () => dispatch(fetchBusinesses());

  const handleDeleteBusiness = async (id: string) => {
    await dispatch(deleteBusiness(id)).unwrap();
  };

  const handleDeleteBranch = async (branch: Branch) => {
    await dispatch(deleteBranch(branch.id)).unwrap();
    await refresh();
  };

  const handleSaveBranch = async (data: BranchFormData) => {
    const payload = {
      branchName: data.branchName,
      branchCode: data.branchCode,
      phone: data.phone,
      email: data.email,
      pincode: data.pincode,
      countryId: data.country,
      stateId: data.state,
      cityId: data.city,
    };
    if (selectedBranch) {
      await dispatch(updateBranch({ branchId: selectedBranch.id, payload })).unwrap();
    } else if (selectedBusinessId) {
      const business = rawBusinesses.find((item) => String(item.id) === selectedBusinessId);
      if (business?.tenantId === undefined) throw new Error("Business tenant is missing.");
      await dispatch(createBranch({ tenantId: business.tenantId, payload })).unwrap();
    }
    await refresh();
  };

  const closeBranchModal = () => {
    setSelectedBranch(null);
    setSelectedBusinessId(null);
    setBranchModalOpen(false);
  };

  return (
    <div>
      {status === "loading" && businesses.length === 0 ? (
        <div className="border border-dashed bg-white p-10 text-center text-muted">Loading businesses...</div>
      ) : (
        <>
          <BusinessList
            businesses={businesses}
            rawRecords={rawBusinesses}
            onAddBusiness={() => router.push("/business-setup")}
            onAddBranch={(businessId) => { setSelectedBusinessId(businessId); setBranchModalOpen(true); }}
            onEditBusiness={(id) => router.push(`/manage-business/edit?id=${id}`)}
            onDeleteBusiness={handleDeleteBusiness}
            onEditBranch={(branch) => { setSelectedBranch(branch); setBranchModalOpen(true); }}
            onDeleteBranch={handleDeleteBranch}
          />
          <AddBranchModal
            open={branchModalOpen}
            onClose={closeBranchModal}
            initialValues={selectedBranch ? toBranchFormData(selectedBranch) : undefined}
            onSubmit={handleSaveBranch}
          />
        </>
      )}
    </div>
  );
}
