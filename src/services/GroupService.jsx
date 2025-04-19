// src/services/groupService.js
import axiosClient from "../utils/axiosClient";

export const getAllGroups = async () => {
  const res = await axiosClient.get(`/groups/getAllGroups`);
  return res.data.data;
};

export const getGroupById = async (id) => {
  const res = await axiosClient.get(`/groups/getGroupById/${id}`);
  return res.data.data;
};

export const createGroup = async (groupDTO) => {
  const res = await axiosClient.post(`/groups/createGroup`, groupDTO);
  return res.data.data;
};

export const updateGroup = async (id, groupDTO) => {
  const res = await axiosClient.put(`/groups/updateGroup/${id}`, groupDTO);
  return res.data.data;
};

export const deleteGroup = async (id) => {
  const res = await axiosClient.put(`/groups/controlDeleteGroup/${id}`);
  return res.data.data;
};

export const getGroupsByCreateBy = async (createById) => {
  const res = await axiosClient.get(`/groups/getGroupByCreateBy/${createById}`);
  return res.data.data;
};

export const getGroupsByKeyword = async (keyword) => {
  const res = await axiosClient.get(`/groups/getGroupByKeyword/${keyword}`);
  return res.data.data;
};

export const getGroupSorted = async (column = "groupID", order = "asc") => {
  const res = await axiosClient.get(`/groups/getGroupSorted`, {
    params: { column, order },
  });
  return res.data.data;
};

export const getJoinedGroupsByUserId = async (userId) => {
  const res = await axiosClient.get(`/groups/getGroupsJoinedByUser/${userId}`);
  return res.data.data;
};

export const getGroupMemberCount = async (groupId) => {
  const res = await axiosClient.get(`/groups/getGroupMemberCount/${groupId}`)
  return res.data.data;
}

export const getGroupMember = async (groupId) => {
  const res = await axiosClient.get(`/groups/getGroupMember/${groupId}`)
  console.log(res.data);
  return res.data.data;
}

