import { useSnackbar } from 'notistack';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as yup from 'yup';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { TCourse } from 'types/course';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { PATH_DASHBOARD } from 'routes/paths';
import {
  Autocomplete,
  Button,
  Card,
  Chip,
  Grid,
  InputAdornment,
  MenuItem,
  Stack,
  styled,
  TextField,
  Typography,
  Divider,
} from '@mui/material';
import { isBefore } from 'date-fns';
import {
  RHFTextField,
  FormProvider,
  RHFEditor,
  RHFUploadMultiFile,
  RHFSwitch,
  RHFRadioGroup,
  RHFSelect,
  RHFUploadSingleFile,
} from 'components/hook-form';
import { LoadingButton, MobileDateTimePicker, DateTimePicker } from '@mui/lab';
import ModalSubjectForm from './components/ModalSubjectForm';
import useLocales from 'hooks/useLocales';
import { useQuery } from 'react-query';
import subjectApi from 'apis/subject';
import { AutoCompleteField, SelectField } from 'components/form';
import request from 'utils/axios';
import Page from 'components/Page';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
import courseApi from 'apis/course';
import { get } from 'lodash';
import { CalendarStyle, CalendarToolbar } from 'sections/@dashboard/calendar';
import FullCalendar, { DateSelectArg, EventClickArg, EventDropArg } from '@fullcalendar/react';
import useResponsive from 'hooks/useResponsive';
// import { CalendarView } from '@types/calendar';
import {
  closeModal,
  openModal,
  selectEvent,
  selectRange,
  updateEvent,
} from 'redux/slices/calendar';
import { useDispatch, useSelector } from 'redux/store';
import interactionPlugin, { EventResizeDoneArg } from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import timelinePlugin from '@fullcalendar/timeline';
// import { CalendarView } from '@types/calendar';

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

type Props = {
  isEdit: boolean;
};

function CourseNewEditForm({ isEdit }: Props) {
  const navigate = useNavigate();

  const { translate } = useLocales();

  const { enqueueSnackbar } = useSnackbar();

  const [isView, setIsView] = useState(false);

  const { id } = useParams();
  const { pathname } = useLocation();
  const viewCourse = pathname.includes('view');
  const isDesktop = useResponsive('up', 'sm');
  const [date, setDate] = useState(new Date());
  const calendarRef = useRef<FullCalendar>(null);
  const [view, setView] = useState(isDesktop ? 'dayGridMonth' : 'listWeek');
  const dispatch = useDispatch();
  const { events, isOpenModal, selectedRange } = useSelector((state) => state.calendar);

  const handleClickToday = () => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.today();
      setDate(calendarApi.getDate());
    }
  };

  // const handleChangeView = (newView: CalendarView) => {
  //   const calendarEl = calendarRef.current;
  //   if (calendarEl) {
  //     const calendarApi = calendarEl.getApi();
  //     calendarApi.changeView(newView);
  //     setView(newView);
  //   }
  // };

  const handleClickDatePrev = () => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.prev();
      setDate(calendarApi.getDate());
    }
  };

  const handleClickDateNext = () => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.next();
      setDate(calendarApi.getDate());
    }
  };

  const handleSelectRange = (arg: DateSelectArg) => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.unselect();
    }
    dispatch(selectRange(arg.start, arg.end));
  };

  const handleSelectEvent = (arg: EventClickArg) => {
    dispatch(selectEvent(arg.event.id));
  };

  const handleResizeEvent = async ({ event }: EventResizeDoneArg) => {
    try {
      dispatch(
        updateEvent(event.id, {
          allDay: event.allDay,
          start: event.start,
          end: event.end,
        })
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleDropEvent = async ({ event }: EventDropArg) => {
    try {
      dispatch(
        updateEvent(event.id, {
          allDay: event.allDay,
          start: event.start,
          end: event.end,
        })
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddEvent = () => {
    dispatch(openModal());
  };

  const handleCloseModal = () => {
    dispatch(closeModal());
  };

  useEffect(() => {
    if (viewCourse) {
      setIsView(true);
    } else {
      setIsView(false);
    }
  }, [viewCourse, setIsView]);

  const schema = yup.object().shape({
    name: yup.string().required('Name is required'),
    minQuantity: yup.number().required('Min quantity is required.'),
    maxQuantity: yup
      .number()
      .required('Max quantity is required.')
      .when('minQuantity', (minQuantity, maxQuantity): any => {
        if (Number(maxQuantity) < Number(minQuantity)) {
          return yup.string().required('Max must be larger than Min');
        }
      }),
    // description: yup.string().required('Description is required'),
    // images: yup.array().min(1, 'Images is required'),
    // price: yup.number().moreThan(0, 'Price should not be $0.00'),
  });

  const { data: course, isLoading } = useQuery(
    ['course', id],
    () => courseApi.getCourseById(Number(id)),
    {
      select: (res) => res.data,
    }
  );

  const methods = useForm<TCourse>({
    resolver: yupResolver(schema),
    defaultValues: {
      ...course,
    },
  });

  const {
    reset,
    watch,
    control,
    setValue,
    getValues,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const isDateError = isBefore(new Date(values.endDate), new Date(values.startDate));
  const products = watch('name');
  const setProducts = (products: any) => {
    setValue('name', products);
  };

  const { data: subjects } = useQuery('subjectForCourse', () =>
    request.get('/subjects').then((res) => res?.data.data)
  );
  const subjectOptions = subjects?.map((c: any) => ({ label: c.name, value: c.id }));
  const getSubject = (option: any) => {
    if (!option) return option;
    if (!option.value) return subjectOptions?.find((opt: any) => opt.value === option);
    return option;
  };

  const { data: mentors } = useQuery(['mentorForCourse'], () =>
    request.get('/admin/users?role-id=2').then((res) => res?.data.data)
  );
  const mentorOptions = mentors?.map((c: any) => ({ label: c.fullName, value: c.id }));
  const getMentor = (option: any) => {
    if (!option) return option;
    if (!option.value) return mentorOptions?.find((opt: any) => opt.value === option);
    return option;
  };

  const courseTypes = [
    {
      id: 1,
      name: 'Ngắn hạn',
    },
    {
      id: 2,
      name: 'Dài hạn',
    },
  ];
  const courseTypeOptions = courseTypes?.map((c: any) => ({ label: c.name, value: c.id }));
  const getCourseType = (option: any) => {
    if (!option) return option;
    if (!option.value) return courseTypeOptions?.find((opt: any) => opt.value === option);
    return option;
  };

  useEffect(() => {
    if (course) {
      methods.reset(course as TCourse);
    }
  }, [course, methods]);

  const onSubmit = async (course: TCourse) => {
    try {
      await courseApi
        .update(course.id, course!)
        .then(() =>
          enqueueSnackbar(`Cập nhât thành công`, {
            variant: 'success',
          })
        )
        .then(() => navigate(PATH_DASHBOARD.courses.list))
        .catch((err: any) => {
          const errMsg = get(err.response, ['data', 'message'], `Có lỗi xảy ra. Vui lòng thử lại`);
          enqueueSnackbar(errMsg, {
            variant: 'error',
          });
        });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        setValue(
          'imageUrl',
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
      }
    },
    [setValue]
  );

  const handleRemoveAll = () => {
    setValue('imageUrl', []);
  };

  const handleRemove = (file: File | string) => {
    const filteredItems = values.imageUrl?.filter((_file) => _file !== file);
    setValue('imageUrl', filteredItems);
  };

  return (
    <>
      <FormProvider {...methods} methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Page
          title={`Khoá học`}
          isTable
          content={
            <HeaderBreadcrumbs
              heading=""
              links={[
                { name: `${translate('dashboard')}`, href: PATH_DASHBOARD.root },
                {
                  name: `Khoá học`,
                  href: PATH_DASHBOARD.courses.root,
                },
                { name: isView ? `Chi tiết` : `Cập nhật khoá học` },
              ]}
            />
          }
        >
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card sx={{ p: 3 }}>
                <Stack spacing={3}>
                  <RHFTextField name="name" label="Tên khoá học" disabled={isView} />

                  <AutoCompleteField
                    options={subjectOptions}
                    getOptionLabel={(value: any) => getSubject(value)?.label || ''}
                    isOptionEqualToValue={(option: any, value: any) => {
                      if (!option) return option;
                      return option.value === getSubject(value)?.value;
                    }}
                    transformValue={(opt: any) => opt?.value}
                    size="large"
                    type="text"
                    label={'Chọn môn học'}
                    name="subjectId"
                    fullWidth
                    disabled={isView}
                  />

                  <Grid xs={12} display="flex">
                    <AutoCompleteField
                      disabled={isView}
                      options={mentorOptions}
                      getOptionLabel={(value: any) => getMentor(value)?.label || ''}
                      isOptionEqualToValue={(option: any, value: any) => {
                        if (!option) return option;
                        return option.value === getMentor(value)?.value;
                      }}
                      transformValue={(opt: any) => opt?.value}
                      name="mentorId"
                      size="large"
                      type="text"
                      label="Giảng viên"
                      fullWidth
                    />
                    <Divider variant="middle" />
                    <AutoCompleteField
                      disabled={isView}
                      options={courseTypeOptions}
                      getOptionLabel={(value: any) => getCourseType(value)?.label}
                      isOptionEqualToValue={(option: any, value: any) => {
                        if (!option) return option;
                        return option.value === getCourseType(value);
                      }}
                      transformValue={(opt: any) => opt?.value}
                      name="type"
                      size="large"
                      type="text"
                      label="Hình thức giảng dạy"
                      fullWidth
                    />
                  </Grid>

                  <div>
                    <LabelStyle>Description</LabelStyle>
                    <RHFEditor simple name="description" />
                  </div>

                  <div>
                    <LabelStyle>Images</LabelStyle>
                    <RHFUploadSingleFile
                      name="imageUrl"
                      accept="image/*"
                      maxSize={3145728}
                      onDrop={handleDrop}
                      disabled={isView}
                    />
                  </div>
                </Stack>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Stack spacing={3}>
                <Card sx={{ p: 3 }}>
                  {/* <RHFSwitch name="inStock" label="In stock" /> */}

                  <RHFTextField name="location" label="Địa chỉ" sx={{ pb: 3 }} disabled={isView} />

                  <RHFTextField name="slug" label="Slug" sx={{ pb: 3 }} disabled={isView} />

                  <Grid xs={12} display="flex">
                    <Grid xs={12}>
                      <AutoCompleteField
                        disabled={isView}
                        options={Array.from({ length: 100 }, (_, index) => index + 1)}
                        name="minQuantity"
                        size="large"
                        type="text"
                        label="Số học viên tối thiểu"
                        fullWidth
                      />
                    </Grid>

                    <Divider variant="middle" />

                    <Grid xs={12}>
                      <AutoCompleteField
                        disabled={isView}
                        options={Array.from({ length: 100 }, (_, index) => index + 1)}
                        name="maxQuantity"
                        size="large"
                        type="text"
                        label="Số học viên tối đa"
                        fullWidth
                      />
                    </Grid>
                  </Grid>

                  <Stack spacing={3} mt={2}>
                    {/* <RHFTextField name="code" label="Product Code" /> */}

                    {/* <RHFTextField name="sku" label="Product SKU" /> */}

                    {/* <div>
                  <LabelStyle>Gender</LabelStyle>
                  <RHFRadioGroup
                    name="gender"
                    options={GENDER_OPTION}
                    sx={{
                      '& .MuiFormControlLabel-root': { mr: 4 },
                    }}
                  />
                </div> */}

                    {/* <RHFSelect name="category" label="Category">
                  {CATEGORY_OPTION.map((category) => (
                    <optgroup key={category.group} label={category.group}>
                      {category.classify.map((classify) => (
                        <option key={classify} value={classify}>
                          {classify}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </RHFSelect> */}

                    <Grid xs={12}>
                      <Controller
                        name="startDate"
                        control={control}
                        render={({ field }) => (
                          <DateTimePicker
                            {...field}
                            label="Ngày bắt đầu"
                            inputFormat="dd/MM/yyyy hh:mm a"
                            renderInput={(params) => <TextField {...params} fullWidth />}
                            disabled={isView}
                          />
                        )}
                      />
                    </Grid>

                    <Grid xs={12}>
                      <Controller
                        name="endDate"
                        control={control}
                        render={({ field }) => (
                          <DateTimePicker
                            {...field}
                            label="Ngày kết thúc"
                            inputFormat="dd/MM/yyyy hh:mm a"
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                fullWidth
                                error={!!isDateError}
                                helperText={
                                  isDateError && 'Ngày kết thúc phải lớn hơn ngày bắt đầu'
                                }
                              />
                            )}
                            disabled={isView}
                          />
                        )}
                      />
                    </Grid>

                    <RHFTextField
                      size="medium"
                      type="number"
                      name="price"
                      label="Giá"
                      onChange={(event) => setValue(`price`, Number(event.target.value))}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                      disabled={isView}
                    />

                    {/* <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={MIN_QUANTITY}
                  sx={{ width: 300 }}
                  renderInput={(params) => <TextField {...params} label="Số lượng tối đa" />}
                /> */}

                    {/* <SelectField
                  key={'min_quantity'}
                  label={'Số lượng tối thiểu'}
                  name={'minQuantity'}
                  size={'large'}
                >
                  {MIN_QUANTITY?.map((idx) => (
                    <MenuItem value={Number(idx)} key={`min_quantity_${idx}`}>
                      {Number(idx)}
                    </MenuItem>
                  ))}
                </SelectField>

                <SelectField
                  key={'max_quantity'}
                  label={'Số lượng tối đa'}
                  name={'maxQuantity'}
                  size={'large'}
                >
                  {MIN_QUANTITY?.map((idx) => (
                    <MenuItem value={Number(idx)} key={`max_quantity_${idx}`}>
                      {Number(idx)}
                    </MenuItem>
                  ))}
                </SelectField> */}

                    {/* <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      multiple
                      freeSolo
                      onChange={(event, newValue) => field.onChange(newValue)}
                      options={TAGS_OPTION.map((option) => option)}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip
                            {...getTagProps({ index })}
                            key={option}
                            size="small"
                            label={option}
                          />
                        ))
                      }
                      renderInput={(params) => <TextField label="Tags" {...params} />}
                    />
                  )}
                /> */}
                  </Stack>
                </Card>

                {/* <Card sx={{ p: 3 }}>
              <Stack spacing={3} mb={2}>
                <RHFTextField
                  name="price"
                  label="Regular Price"
                  placeholder="0.00"
                  value={getValues('price') === 0 ? '' : getValues('price')}
                  onChange={(event) => setValue('price', Number(event.target.value))}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    type: 'number',
                  }}
                />

                <RHFTextField
                  name="priceSale"
                  label="Sale Price"
                  placeholder="0.00"
                  value={getValues('priceSale') === 0 ? '' : getValues('priceSale')}
                  onChange={(event) => setValue('price', Number(event.target.value))}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    type: 'number',
                  }}
                />
              </Stack>

              <RHFSwitch name="taxes" label="Price includes taxes" />
            </Card> */}

                {values.status !== 2 ? (
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    size="large"
                    loading={isSubmitting}
                  >
                    Lưu thay đổi
                  </LoadingButton>
                ) : (
                  <Grid item xs={12} display={'flex'} justifyContent={'center'}>
                    <LoadingButton
                      type="submit"
                      variant="outlined"
                      size="large"
                      loading={isSubmitting}
                      onClick={() => setValue('status', 4)}
                    >
                      Từ chối
                    </LoadingButton>
                    <Divider variant="middle" />
                    <LoadingButton
                      type="submit"
                      variant="contained"
                      size="large"
                      loading={isSubmitting}
                      onClick={() => setValue('status', 3)}
                    >
                      Duyệt
                    </LoadingButton>
                  </Grid>
                )}
              </Stack>
            </Grid>
          </Grid>

          <Card>
            <CalendarStyle>
              <CalendarToolbar
                date={date}
                // view={view}
                onNextDate={handleClickDateNext}
                onPrevDate={handleClickDatePrev}
                onToday={handleClickToday}
                onChangeView={() => console.log('')}
                view={'dayGridMonth'}
              />
              <FullCalendar
                weekends
                editable
                droppable
                selectable
                events={events}
                ref={calendarRef}
                rerenderDelay={10}
                initialDate={date}
                initialView={view}
                dayMaxEventRows={3}
                eventDisplay="block"
                headerToolbar={false}
                allDayMaintainDuration
                eventResizableFromStart
                select={handleSelectRange}
                eventDrop={handleDropEvent}
                eventClick={handleSelectEvent}
                eventResize={handleResizeEvent}
                height={isDesktop ? 720 : 'auto'}
                plugins={[
                  listPlugin,
                  dayGridPlugin,
                  timelinePlugin,
                  timeGridPlugin,
                  interactionPlugin,
                ]}
              />
            </CalendarStyle>
          </Card>
        </Page>
      </FormProvider>
    </>
  );
}

export default CourseNewEditForm;
