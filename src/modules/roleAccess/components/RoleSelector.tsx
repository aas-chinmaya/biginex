import type { RoleSelectorProps } from '@/modules/roleAccess/types';

export default function RoleSelector({ roles, selectedRoleId, onSelectRole }: RoleSelectorProps) {
  return (
    <div>
      
      <select
        value={selectedRoleId ?? ''}
        onChange={(event) => onSelectRole(event.target.value)}
        className="w-full max-w-[180px] rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
      >
        <option value="" disabled>
          Select role
        </option>
        {roles.map((role) => (
          <option key={String(role.id)} value={String(role.id)}>
            {role.name}
          </option>
        ))}
      </select>
    </div>
  );
}
