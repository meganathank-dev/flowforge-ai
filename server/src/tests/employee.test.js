import '../tests/setup.js';
import { describe, it, mock } from 'node:test';
import assert from 'node:assert/strict';
import * as employeeService from '../services/employee-profile.service.js';
import * as employeeRepository from '../repositories/employee-profile.repository.js';
import EmployeeProfile from '../models/employee-profile.model.js';

describe('Employee Tenant Isolation', () => {
  describe('Service Layer Isolation', () => {
    it('should block fetching an employee not belonging to the tenant (IDOR prevention)', async () => {
      mock.method(EmployeeProfile, 'findOne', () => {
        return {
          populate: () => ({
            exec: async () => null // Simulates not found / wrong tenant
          })
        };
      });

      // Tenant 2 attempting to fetch Tenant 1's employee
      await assert.rejects(
        () => employeeService.getEmployeeById('emp1', 'org2'),
        { statusCode: 404, message: 'Employee not found' }
      );

      mock.restoreAll();
    });
  });

  describe('Repository Layer Isolation', () => {
    it('should inject organizationId into findOne query', async () => {
      let queryPassed = null;
      mock.method(EmployeeProfile, 'findOne', (query) => {
        queryPassed = query;
        return {
          populate: () => ({
            exec: async () => ({ id: 'emp1' })
          })
        };
      });

      await employeeRepository.findByIdAndOrganization('emp1', 'tenant123');

      assert.ok(queryPassed);
      assert.equal(queryPassed.organizationId, 'tenant123', 'organizationId must be injected into the query');
      assert.equal(queryPassed._id, 'emp1');

      mock.restoreAll();
    });
  });
});
