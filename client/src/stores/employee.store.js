import { create } from 'zustand';
import * as employeeService from '../services/employee.service.js';

export const useEmployeeStore = create((set) => ({
  employees: [],
  pagination: null,
  selectedEmployee: null,
  isLoading: false,
  error: null,

  fetchEmployees: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const result = await employeeService.getEmployees(params);
      set({
        employees: result.data,
        pagination: result.pagination,
        isLoading: false
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch employees',
        isLoading: false
      });
    }
  },

  fetchEmployeeById: async (id) => {
    set({ isLoading: true, error: null, selectedEmployee: null });
    try {
      const employee = await employeeService.getEmployeeById(id);
      set({ selectedEmployee: employee, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch employee',
        isLoading: false
      });
    }
  },

  createEmployee: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await employeeService.createEmployee(data);
      set({ isLoading: false });
      // Optionally trigger re-fetch in component or return true for success
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to create employee',
        isLoading: false
      });
      return false;
    }
  },

  clearEmployees: () => {
    set({
      employees: [],
      pagination: null,
      selectedEmployee: null,
      error: null
    });
  },
}));
