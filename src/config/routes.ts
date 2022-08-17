import { Routes } from "@nestjs/core";
import AccountsModule from "src/modules/account/accounts.module";

import AdminsModule from "src/modules/admin/admins.module";
import AuthModule from "src/modules/auth/auth.module";
import CompaniesModule from "src/modules/company/companies.module";
import RolesModule from "src/modules/roles/roles.module";
import SecurityQuestionsModule from "src/modules/security-question/security-question.module";
import WalletsModule from "src/modules/wallets/wallets.module";

export const ROUTES: Routes = [
    {
        path: '/v1',
        children: [
            { path: '/auth', module: AuthModule },
            { path: '/admins', module: AdminsModule },
            { path: '/accounts', module: AccountsModule },
            { path: '/roles', module: RolesModule },
            { path: '/companies', module: CompaniesModule },
            { path: '/wallets', module: WalletsModule },
            { path: '/security-questions', module: SecurityQuestionsModule },
        ],
    },
];