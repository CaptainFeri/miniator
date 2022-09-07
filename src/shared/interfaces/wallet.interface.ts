/* eslint-disable */
import { Observable } from "rxjs";

export interface ID {
  id: string;
}

export interface SuccessResponse {
  success: string;
}

export interface Company {
  id: string;
  minDeposit: number;
  maxDeposit: number;
  minWithdrawal: number;
  maxWithdrawal: number;
  maxCapacity: number;
  name: string;
  companyId: string;
}

export interface CreateCompanyRequest {
  minDeposit: number;
  maxDeposit: number;
  minWithdrawal: number;
  maxWithdrawal: number;
  maxCapacity: number;
  name: string;
  companyId: string;
}

export interface UpdateCompanyRequest {
  id?: string | undefined;
  minDeposit?: number | undefined;
  maxDeposit?: number | undefined;
  minWithdrawal?: number | undefined;
  maxWithdrawal?: number | undefined;
  maxCapacity?: number | undefined;
  name?: string | undefined;
  companyId?: string | undefined;
}

export interface Wallet {
  id: string;
  balance: number;
}

export interface CreateWalletRequest {
  companyId: string;
  walletId: string;
}

export const WALLET_PACKAGE_NAME = "wallet";

export interface CompanyServiceClient {
  create(request: CreateCompanyRequest): Observable<ID>;

  update(request: UpdateCompanyRequest): Observable<SuccessResponse>;
}


export const COMPANY_SERVICE_NAME = "CompanyService";

export interface WalletServiceClient {
  create(request: CreateWalletRequest): Observable<ID>;
}

export const WALLET_SERVICE_NAME = "WalletService";
