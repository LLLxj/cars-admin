<template>
  <div>
    <el-form :model="dataForm" ref="dataForm" :rules="rules" label-width="150px">
      <el-form-item label="姓名" prop="userName">
        <el-input v-model="dataForm.userName" placeholder="请输入姓名" clearable></el-input>
      </el-form-item>
      <el-form-item label="身份证号码" prop="idNumber">
        <el-input v-model="dataForm.idNumber" placeholder="请输入身份证号码" clearable></el-input>
      </el-form-item>
      <el-form-item label="电话号码" prop="phoneNumber">
        <el-input v-model="dataForm.phoneNumber" placeholder="请输入电话号码" clearable></el-input>
      </el-form-item>
      <el-form-item label="贷款成数" prop="percent">
        <el-input v-model="dataForm.percent" placeholder="请输入贷款成数" clearable></el-input>
      </el-form-item>
      <el-form-item label="是否在被执行中" prop="isExecute">
        <el-radio-group v-model="dataForm.isExecute">
          <el-radio :label="0">否</el-radio>
          <el-radio :label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否为事故车" prop="isAccidentCar">
        <el-radio-group v-model="dataForm.isAccidentCar">
          <el-radio :label="0">否</el-radio>
          <el-radio :label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="车龄要求" prop="carAge">
        <el-input v-model="dataForm.carAge" placeholder="请输入车龄要求" clearable></el-input>
      </el-form-item>
      <el-form-item label="已过科目几" prop="subject">
        <el-select v-model="dataForm.subject" class="box-input" placeholder="请选择已过科目">
          <el-option v-for="item in subjectList" :key="item.value" :label="item.label" :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="是否有驾驶证" prop="isDriverCard">
        <el-radio-group v-model="dataForm.isDriverCard">
          <el-radio :label="0">否</el-radio>
          <el-radio :label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="名下有按揭车辆台数" prop="mortgageCarNum">
        <el-input v-model="dataForm.mortgageCarNum" placeholder="请输入名下有按揭车辆台数" clearable></el-input>
      </el-form-item>
      <el-form-item label="是否蓝牌货车可做" prop="isBlueCard">
        <el-radio-group v-model="dataForm.isBlueCard">
          <el-radio :label="0">否</el-radio>
          <el-radio :label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="产品" prop="recordIdList">
        <el-select
          v-model="dataForm.recordIdList"
          filterable
          :multiple="true"
          :clearable="true"
          placeholder="请选择"
        >
          <el-option
            v-for="item in recordList"
            :key="item.recordId"
            :label="item.recordName"
            :value="item.recordId"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <el-button v-if="isAuth('loan:credit:assess')" type="primary" @click="dataFormSubmit()">确定</el-button>
    <el-dialog
      title="产品推荐"
      :close-on-click-modal="false"
      :visible.sync="visible" @close="cancle">
        <el-table :data="dataList" border stripe>
          <el-table-column type="index" align="center" header-align="center" width="80" label="NO" fixed/>
          <el-table-column prop="fraction" align="center" header-align="center" width="80" label="排序"/>
          <el-table-column prop="productName" header-align="center" align="center" label="产品名称" min-width="140px" />
        </el-table>
    </el-dialog>
  </div>
</template>

<script>
  import { isMobile, removeBlank } from '@/utils/validate'
  import Business from '@/api/product/business'
  import BusinessSelect from '@/views/common-select/all-business-select'
  import Credit from '@/api/product/credit'
  import Record from '@/api/product/record'
  import Product from '@/api/product/product'
  export default {
    data () {
      var removeSpace = (rule, value, callback) => {
        this.dataForm.userName = removeBlank(value)
        callback()
      }
      var validateMobile = (rule, value, callback) => {
        if (!isMobile(value)) {
          callback(new Error('手机号格式错误'))
        } else {
          callback()
        }
      }
      return {
        visible: false,
        judicialRiskList: [
          { label: '无风险', value: 0 },
          { label: '低风险', value: 1 },
          { label: '中风险', value: 2 },
          { label: '高风险', value: 3 }
        ],
        moreBorrowList: [
          { label: '无风险', value: 0 },
          { label: '低风险', value: 1 },
          { label: '中风险', value: 2 },
          { label: '高风险', value: 3 }
        ],
        subjectList: [
          { label: '科目一', value: 0 },
          { label: '科目二', value: 1 },
          { label: '科目三', value: 2 },
          { label: '科目四', value: 3 }
        ],
        recordList: [],
        dataForm: {
          userName: '',
          idNumber: '',
          percent: '',
          interestRate: '',
          creditRating: '',
          age: '',
          isExecute: null,
          judicialRisk: '',
          moreBorrow: '',
          isAccidentCar: '',
          carAge: '',
          subject: '',
          ageNoGuarantee: '',
          isDriverCard: '',
          mortgageCarNum: '',
          isBlueCard: '',
          loanBankNum: '',
          loanUnBankNum: '',
          recordIdList: []
        },
        id: '',
        rules: {
          userName: [
            { required: true, message: '请输入姓名', trigger: 'blur' }
          ],
          idNumber: [
            { required: true, message: '请输入身份证号码', trigger: 'blur' }
          ],
          phoneNumber: [
            { required: true, message: '请输入电话号码', trigger: 'blur' }
          ],
          percent: [
            { required: true, message: '请输入贷款成数', trigger: 'blur' }
          ],
          interestRate: [
            { required: true, message: '请输入贷款利率', trigger: 'blur' }
          ],
          creditRating: [
            { required: true, message: '请输入信用等级', trigger: 'blur' }
          ],
          age: [
            { required: true, message: '请输入年龄要求', trigger: 'blur' }
          ],
          isExecute: [
            { required: true, message: '请选择', trigger: 'blur' }
          ],
          judicialRisk: [
            { required: true, message: '请选择司法风险', trigger: 'blur' }
          ],
          moreBorrow: [
            { required: true, message: '请选择多头借贷风险', trigger: 'blur' }
          ],
          isAccidentCar: [
            { required: true, message: '请选择是否可做事故车', trigger: 'blur' }
          ],
          carAge: [
            { required: true, message: '请输入车龄要求', trigger: 'blur' }
          ],
          subject: [
            { required: true, message: '请选择已过科目', trigger: 'blur' }
          ],
          ageNoGuarantee: [
            { required: true, message: '请输入免担保年龄要求', trigger: 'blur' }
          ],
          isDriverCard: [
            { required: true, message: '请选择是否有驾驶证', trigger: 'blur' }
          ],
          mortgageCarNum: [
            { required: true, message: '请输入名下有按揭车辆台数', trigger: 'blur' }
          ],
          isBlueCard: [
            { required: true, message: '请选择是否蓝牌货车可做', trigger: 'blur' }
          ],
          loanBankNum: [
            { required: true, message: '请输入银行机构借款申请次数', trigger: 'blur' }
          ],
          loanUnBankNum: [
            { required: true, message: '请输入非银行机构借款申请次数', trigger: 'blur' }
          ],
          recordIdList: [
            { required: true, message: '请选择产品', trigger: 'blur' }
          ],
        }
      }
    },
    components: {
      BusinessSelect
    },
    watch: {
    },
    created () {
      this.getAllList()
    },
    methods: {
      init (id) {
        this.id = id
        this.visible = true
      },
      getAllList () {
        Record.getAllList().then(res => {
          console.log(res)
          const { code, data } = res.data
          if (code === 0) {
            this.recordList = data
          }
        })
      },
      resetForm() {
        this.$refs['dataForm'].resetFields()
      },
      cancle () {
        this.visible = false
        this.resetForm()
      },
      cancle () {
        this.visible = false
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            Credit.create(this.dataForm).then(({data}) => {
              console.log(data)
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = true
                    this.dataList = data.data
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
            }).catch(err => {
              console.log(err)
              this.$message.error(err)
            })
          }
        })
      }
    }
  }
</script>
