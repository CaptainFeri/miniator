import { Get, UseGuards, Post, Body, Controller, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SubadminAuthGuard } from 'src/subadmin/auth/Guard/subadmin.guard';
import { createSecurityQuestionDto } from 'src/security-q/dto/security-question.dto';
import { SuperadminService } from '../superadmin.service';
import { AdminAuthGuard } from '../auth/Guard/admin.guard';

@ApiTags('admin-security-question-managment')
@Controller('super-admin')
export class AdminSecurityQuestionManagmentController {
  constructor(private readonly superAdminService: SuperadminService) {}

  @Get('security-questions')
  @ApiBearerAuth()
  @UseGuards(AdminAuthGuard)
  async getQuestions() {
    const questions = await this.superAdminService.getQuestions();
    return {
      data: questions,
    };
  }

  @Post('security-question')
  @ApiBearerAuth()
  @UseGuards(AdminAuthGuard)
  async createSecurityQuestion(@Body() data: createSecurityQuestionDto) {
    const newSecurity = await this.superAdminService.createSecurityQuestion(
      data,
    );
    return {
      data: newSecurity,
    };
  }

  @Post('security-question/:id')
  @ApiBearerAuth()
  @UseGuards(AdminAuthGuard)
  async updateSecurityQuestion(
    @Param('id') id: number,
    @Body() data: createSecurityQuestionDto,
  ) {
    const updateSecurityQuestion =
      await this.superAdminService.updateSecurityQuestion(data, id);
    return {
      data: updateSecurityQuestion,
    };
  }
}
