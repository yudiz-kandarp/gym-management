import { getClientList } from 'Query/Client/client.query'
import { commonLists } from 'Query/Common/common.query'
import { getFreeResource, getLatestProjects, getMonthlyProjects } from 'Query/Dashboard/dashboard.query'
import { departmentList, getEmployeeList, jobProfileList, roleList, permissionList } from 'Query/Employee/employee.query'
import { TechnologyList } from 'Query/Interview/interviews.query'
import { getProjectList, getProjectTags } from 'Query/Project/project.query'
import { getSkillList } from 'Query/Skill/skill.query'
import { getLoggedInUserProjects, getWorklogTags } from 'Query/Worklog/worklog.query'
import { useEffect, useRef, useState } from 'react'
import { useQueries } from 'react-query'

export default function useDetails(queryKeys) {
  // if (options?.callOnCondition) return { handleScroll, stopScroll, handleSearch }

  const [resourceDetail, setResourceDetail] = useState({})
  const [allData, setAllData] = useState({})
  const [timeoutHandle, setTimeoutHandle] = useState()
  const [pages, setPages] = useState({})
  const [searches, setSearches] = useState({})

  const dataConfig = {}

  queryKeys?.forEach((element) => {
    dataConfig[element] = {
      page: 0,
      limit: 15,
      next: false,
      search: '',
      isSearching: false,
    }
  })

  const lazyLoad = useRef(dataConfig)

  function setLazyLoad(value, property, { isSearch }) {
    if (typeof value === 'function') {
      lazyLoad.current = value(lazyLoad.current)
    } else {
      lazyLoad.current = value
    }
    if (property && lazyLoad.current[property]?.page) {
      setPages((p) => ({ ...p, [property]: lazyLoad.current[property]?.page }))
    }
    if (isSearch && lazyLoad.current[property]?.isSearching) {
      lazyLoad.current[property].page = 0
      lazyLoad.current[property].next = false
      setSearches((p) => ({ ...p, [property]: lazyLoad.current[property]?.search }))
      if (!lazyLoad.current[property]?.search) {
        lazyLoad.current[property].isSearching = false
        lazyLoad.current[property].page = 0
        lazyLoad.current[property].next = false
        setResourceDetail((p) => ({ ...p, [property]: [] }))
        setSearches((p) => ({ ...p, [property]: lazyLoad.current[property]?.search }))
      }
    }
  }

  function handleSettingData(data, property) {
    if (!Array.isArray(data)) return
    const length = data?.length
    if (!length || !(length >= dataConfig[property].limit)) {
      stopScroll(property)
    } else {
      startScroll(property)
    }
    if (searches?.[property] && lazyLoad.current[property]?.isSearching) {
      setResourceDetail((p) => ({ ...p, [property]: data }))
    } else {
      setResourceDetail((p) => ({ ...p, [property]: [...(p[property]?.length ? p[property] : []), ...(length ? data : [])] }))
    }
  }

  const allQueryConfig = [
    {
      q_key: 'department',
      queryKey: ['resource_department', pages?.department, searches?.department],
      queryFn: () => departmentList(lazyLoad?.current?.department),
      select: (data) => data.data.data.departments,
      onSuccess: function (data) {
        handleSettingData(data, this.q_key)
      },
      refetchOnMount: true,
    },
    {
      q_key: 'role',
      queryKey: ['resource_role', pages?.role, searches?.role],
      queryFn: () => roleList(lazyLoad?.current?.role),
      select: (data) => data.data.data.roles,
      onSuccess: function (data) {
        handleSettingData(data, this.q_key)
      },
      refetchOnMount: true,
    },
    {
      q_key: 'permission',
      queryKey: ['resource_permission', pages?.permission, searches?.permission],
      queryFn: () => permissionList(lazyLoad?.current?.permission),
      select: (data) => data.data.data.permissions,
      onSuccess: function (data) {
        handleSettingData(data, this.q_key)
      },
      refetchOnMount: true,
    },
    {
      q_key: 'skill',
      queryKey: ['resource_skill', pages?.skill, searches?.skill],
      queryFn: () => getSkillList(lazyLoad?.current?.skill),
      select: (data) => data.data.data.skills,
      onSuccess: function (data) {
        handleSettingData(data, this.q_key)
      },
      refetchOnMount: true,
    },
    {
      q_key: 'jobprofile',
      queryKey: ['resource_jobprofile', pages?.jobprofile, searches?.jobprofile],
      queryFn: () => jobProfileList(lazyLoad?.current?.jobprofile),
      select: (data) => data.data.data.jobProfiles,
      onSuccess: function (data) {
        handleSettingData(data, this.q_key)
      },
      refetchOnMount: true,
    },
    {
      q_key: 'FixedProjects',
      queryKey: ['resource_fixed_projects', pages?.FixedProjects, searches?.FixedProjects],
      queryFn: () => getProjectList({ ...lazyLoad?.current?.FixedProjects, eProjectType: 'Fixed' }),
      select: (data) => data.data.data.projects,
      onSuccess: function (data) {
        handleSettingData(data, this.q_key)
      },
      refetchOnMount: true,
    },
    {
      q_key: 'technology',
      queryKey: ['resource_technology', pages?.technology, searches?.technology],
      queryFn: () => TechnologyList(lazyLoad.current?.technology),
      select: (data) => data.data.data.technology,
      onSuccess: function (data) {
        handleSettingData(data, this.q_key)
      },
      refetchOnMount: true,
    },
    {
      q_key: 'ba',
      queryKey: ['resource_ba', pages?.ba, searches?.ba],
      queryFn: () => commonLists({ ...lazyLoad.current?.ba, flag: 'ba' }),
      select: (data) => data.data.data.data,
      onSuccess: function (data) {
        handleSettingData(data, this.q_key)
      },
      refetchOnMount: true,
    },
    {
      q_key: 'bde',
      queryKey: ['resource_bde', pages?.bde, searches?.bde],
      queryFn: () => commonLists({ ...lazyLoad.current?.bde, flag: 'bde' }),
      select: (data) => data.data.data.data,
      onSuccess: function (data) {
        handleSettingData(data, this.q_key)
      },
      refetchOnMount: true,
    },
    {
      q_key: 'client',
      queryKey: ['resource_client', pages?.client, searches?.client],
      queryFn: () => getClientList(lazyLoad.current?.client),
      select: (data) => data.data.data.clients,
      onSuccess: function (data) {
        handleSettingData(data, this.q_key)
      },
      refetchOnMount: true,
    },
    {
      q_key: 'projectManager',
      queryKey: ['resource_projectManager', pages?.projectManager, searches?.projectManager],
      queryFn: () => commonLists({ ...lazyLoad.current?.projectManager, flag: 'pm' }),
      select: (data) => data.data.data.data,
      onSuccess: function (data) {
        handleSettingData(data, this.q_key)
      },
      refetchOnMount: true,
    },
    {
      q_key: 'projectTag',
      queryKey: ['resource_projectTag', pages?.projectTag, searches?.projectTag],
      queryFn: () => getProjectTags(lazyLoad.current?.projectTag),
      select: (data) => data.data.data.projectTag,
      onSuccess: function (data) {
        handleSettingData(data, this.q_key)
      },
      refetchOnMount: true,
    },
    {
      q_key: 'projectOfUserLoggedIn',
      queryKey: ['resource_projectOfUserLoggedIn', pages?.projectOfUserLoggedIn, searches?.projectOfUserLoggedIn],
      queryFn: () => getLoggedInUserProjects(lazyLoad.current?.projectOfUserLoggedIn),
      select: (data) => data.data.data.projects,
      onSuccess: function (data) {
        handleSettingData(data, this.q_key)
      },
      refetchOnMount: true,
    },
    {
      q_key: 'worklogTags',
      queryKey: ['resource_worklogTags', pages?.worklogTags, searches?.worklogTags],
      queryFn: () => getWorklogTags(lazyLoad.current?.worklogTags),
      select: (data) => data.data.data.worklogstags,
      onSuccess: function (data) {
        handleSettingData(data, this.q_key)
      },
      refetchOnMount: true,
    },
    {
      q_key: 'employee',
      queryKey: ['resource_employee', pages?.employee, searches?.employee],
      queryFn: () => getEmployeeList(lazyLoad.current?.employee),
      select: (data) => data.data.data.Employees,
      onSuccess: function (data) {
        handleSettingData(data, this.q_key)
      },
      refetchOnMount: true,
    },
    {
      q_key: 'freeResources',
      queryKey: ['resource_freeResources', pages?.freeResources, searches?.freeResources],
      queryFn: () => getFreeResource(lazyLoad.current?.freeResources),
      select: (data) => data.data.data.freeResource.freeResourceEmployee,
      onSuccess: function (data) {
        handleSettingData(data, this.q_key)
      },
      refetchOnMount: true,
      // ...options?.freeResources,
    },
    {
      q_key: 'latestProjects',
      queryKey: ['resource_latestProjects', pages?.latestProjects, searches?.latestProjects],
      queryFn: () => getLatestProjects(lazyLoad.current?.latestProjects),
      select: (data) => data.data.data.latestProjects,
      onSuccess: function (data) {
        handleSettingData(data, this.q_key)
      },
      refetchOnMount: true,
      // ...options?.latestProjects,
    },
    {
      q_key: 'monthlyProjects',
      queryKey: ['resource_monthlyProjects'],
      queryFn: () => getMonthlyProjects(),
      select: (data) => data.data.data.monthlyProjects,
      onSuccess: function (data) {
        handleSettingData(data, this.q_key)
      },
      refetchOnMount: true,
      // ...options?.monthlyProjects,
    },
  ]

  const requiredQueries = queryKeys?.map((q_data) => allQueryConfig?.find((q) => q?.q_key === q_data))
  const data = useQueries(requiredQueries)

  useEffect(() => {
    if (data?.length) {
      let obj = {}
      data?.forEach((d, i) => (obj[queryKeys[i]] = d))
      setAllData(obj)
    }
  }, [JSON.stringify(data)])

  function handleScroll(property) {
    if (lazyLoad?.current?.[property]?.next) {
      setLazyLoad((p) => ({ ...p, [property]: { ...p[property], page: p[property]?.page + 15 } }), property, { isSearch: false })
    }
  }

  function handleSearch(property, search) {
    if (search) {
      clearTimeout(timeoutHandle)
      const timeout = setTimeout(
        () =>
          setLazyLoad((p) => ({ ...p, [property]: { ...p[property], page: 0, search, isSearching: true } }), property, { isSearch: true }),
        1500
      )
      setTimeoutHandle(timeout)
    } else {
      setLazyLoad((p) => ({ ...p, [property]: { ...p[property], page: 0, search } }), property, { isSearch: true })
    }
  }

  function stopScroll(property) {
    setLazyLoad({ ...lazyLoad.current, [property]: { ...lazyLoad.current?.[property], next: false } }, '', { isSearch: false })
  }

  function startScroll(property) {
    setLazyLoad({ ...lazyLoad.current, [property]: { ...lazyLoad.current?.[property], next: true } }, '', { isSearch: false })
  }
  function createNewOption(property, data) {
    setResourceDetail((prev) => ({ ...prev, [property]: [data, ...prev[property]] }))
  }

  return { lazyLoad, handleScroll, stopScroll, resourceDetail, data: allData, handleSearch, createNewOption }
}
