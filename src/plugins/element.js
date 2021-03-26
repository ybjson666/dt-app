import Vue from 'vue'
import {
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
  Carousel,
  CarouselItem,
  Form,
  FormItem,
  Input,
  InputNumber,
  Button,
  Dialog,
  InfiniteScroll,
  Row,
  Col,
  Select,
  Option,
  OptionGroup,
  Radio,
  RadioGroup,
  RadioButton,
  Checkbox,
  CheckboxButton,
  CheckboxGroup,
  Upload,
  Badge,
  Tabs,
  TabPane,
  Table,
  TableColumn,
  Tag,
  Tree,
  Rate,
  Pagination,
  Progress,
  Popover,
  Steps,
  Step,
  DatePicker,
  Slider,
  Collapse,
  CollapseItem,
  Drawer,
  Cascader,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Tooltip,
  TimeSelect,
  Image,
  Autocomplete,
  MessageBox,
  Message,
  Card,
  Loading
} from 'element-ui'
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Carousel)
Vue.use(CarouselItem)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(InputNumber)
Vue.use(Button)
Vue.use(Dialog)
Vue.use(InfiniteScroll)
Vue.use(Row)
Vue.use(Col)
Vue.use(Select)
Vue.use(Option)
Vue.use(OptionGroup)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(RadioButton)
Vue.use(Checkbox)
Vue.use(CheckboxButton)
Vue.use(CheckboxGroup)
Vue.use(Upload)
Vue.use(Badge)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Rate)
Vue.use(Pagination)
Vue.use(Progress)
Vue.use(Popover)
Vue.use(Steps)
Vue.use(Step)
Vue.use(DatePicker)
Vue.use(Slider)
Vue.use(Collapse)
Vue.use(CollapseItem)
Vue.use(Drawer)
Vue.use(Cascader)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Tooltip)
Vue.use(TimeSelect)
Vue.use(Image)
Vue.use(Autocomplete)
Vue.use(Card)
Vue.use(Loading)
 
Vue.prototype.$message = Message
Vue.prototype.$prompt = MessageBox.prompt

let loading;
const startLoading = () => {
  loading = Loading.service({
    lock: true,
    text: '加载中...',//可以自定义文字
    spinner:'el-icon-loading',//自定义加载图标类名
    background: 'rgba(0, 0, 0, 0.7)'//遮罩层背景色
  });
};
 
const endLoading = () => {
  loading.close();
};

Vue.prototype.$startLoading = startLoading
Vue.prototype.$endLoading = endLoading
