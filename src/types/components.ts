import type { Component } from 'vue';

export type Metric = {
  label: string;
  value: string;
  sub: string;
  up: boolean;
  color: 'blue' | 'orange';
  icon: Component;
};

export type NavItem = {
  id: string;
  label: string;
  icon: Component;
  routeName: string;
  section?: string;
};
