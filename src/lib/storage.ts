// LocalStorage-based persistence for circuits

import { Circuit } from './types';

const STORAGE_KEY = 'archcircuit_circuits';

export class CircuitStorage {
  static getAllCircuits(): Circuit[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading circuits:', error);
      return [];
    }
  }

  static saveCircuit(circuit: Circuit): void {
    try {
      const circuits = this.getAllCircuits();
      const existingIndex = circuits.findIndex(c => c.id === circuit.id);
      
      if (existingIndex !== -1) {
        circuits[existingIndex] = circuit;
      } else {
        circuits.push(circuit);
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(circuits));
    } catch (error) {
      console.error('Error saving circuit:', error);
      throw new Error('Failed to save circuit');
    }
  }

  static getCircuit(id: string): Circuit | null {
    const circuits = this.getAllCircuits();
    return circuits.find(c => c.id === id) || null;
  }

  static deleteCircuit(id: string): void {
    try {
      const circuits = this.getAllCircuits();
      const filtered = circuits.filter(c => c.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting circuit:', error);
      throw new Error('Failed to delete circuit');
    }
  }

  static duplicateCircuit(id: string): Circuit | null {
    try {
      const original = this.getCircuit(id);
      if (!original) return null;

      const duplicate: Circuit = {
        ...original,
        id: `circuit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: `${original.name} (Copy)`,
        status: 'Draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      this.saveCircuit(duplicate);
      return duplicate;
    } catch (error) {
      console.error('Error duplicating circuit:', error);
      return null;
    }
  }
}
