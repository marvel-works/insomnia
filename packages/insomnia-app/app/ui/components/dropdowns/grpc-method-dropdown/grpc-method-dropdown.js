// @flow
import React from 'react';
import { Dropdown, DropdownItem, DropdownDivider } from 'insomnia-components';
import type { GrpcMethodDefinition } from '../../../../network/grpc/method';
import styled from 'styled-components';
import GrpcMethodTag from '../../tags/grpc-method-tag';
import { groupGrpcMethodsByPackage } from '../../../../common/grpc-paths';
import type { GrpcMethodInfo } from '../../../../common/grpc-paths';
import GrpcMethodDropdownButton from './grpc-method-dropdown-button';

type Props = {
  disabled: boolean,
  methods: Array<GrpcMethodDefinition>,
  selectedMethod?: GrpcMethodDefinition,
  handleChange: string => Promise<void>,
  handleChangeProtoFile: string => Promise<void>,
};

const Lowercase = styled.span`
  text-transform: lowercase;
`;

const GrpcMethodDropdown = ({
  disabled,
  methods,
  selectedMethod,
  handleChange,
  handleChangeProtoFile,
}: Props) => {
  const dropdownButton = React.useMemo(
    () => () => <GrpcMethodDropdownButton fullPath={selectedMethod?.path} />,
    [selectedMethod?.path],
  );

  const groupedByPkg = React.useMemo(() => groupGrpcMethodsByPackage(methods), [methods]);

  return (
    <Dropdown className="tall wide" renderButton={dropdownButton}>
      <DropdownItem onClick={handleChangeProtoFile}>
        <em>Click to change proto file</em>
      </DropdownItem>
      {!methods.length && (
        <>
          <DropdownDivider />
          <DropdownItem disabled>No methods found</DropdownItem>
        </>
      )}
      {Object.keys(groupedByPkg).map(pkgName => (
        <React.Fragment key={pkgName}>
          <DropdownDivider children={pkgName && <Lowercase>{pkgName}</Lowercase>} />
          {groupedByPkg[pkgName].map(
            ({ segments: { serviceName, methodName }, type, fullPath }: GrpcMethodInfo) => (
              <DropdownItem
                key={fullPath}
                onClick={handleChange}
                value={fullPath}
                disabled={disabled}
                selected={fullPath === selectedMethod?.path}
                icon={<GrpcMethodTag methodType={type} />}>
                {pkgName ? `${serviceName}/${methodName}` : fullPath}
              </DropdownItem>
            ),
          )}
        </React.Fragment>
      ))}
    </Dropdown>
  );
};

export default GrpcMethodDropdown;
