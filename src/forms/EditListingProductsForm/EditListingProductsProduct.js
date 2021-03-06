import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import Paper from '@material-ui/core/Paper'
import makeStyles from '@material-ui/core/styles/makeStyles'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'
import React from 'react'
import { bool, node, string } from 'prop-types'
import { FieldArray } from 'react-final-form-arrays'
import { connect } from 'react-redux'
import _ from 'lodash'
import { Field } from 'react-final-form'
import AddIcon from '@material-ui/icons/Add'
import DeleteIcon from '@material-ui/icons/Delete'
import MPopover from '../../components/MPopover/MPopover'
import { MRadioGroup } from '../../components/MRadioGroup/MRadioGroup'
import { FormattedMessage, intlShape } from '../../util/reactIntl'
import FieldReactSelect from '../../components/FieldReactSelect/FieldReactSelect'
import MField from '../../components/MField/MField'
import MButton from '../../components/MButton/MButton'
import { updateListingAdHoc } from '../../containers/EditListingPage/EditListingPage.duck'

import { composeValidators, moneySubUnitAmountAtLeast, required } from '../../util/validators'
import { FieldTextInput, FieldCurrencyInput, SelectImage } from '../../components'
import config from '../../config'
import { formatMoney } from '../../util/currency'
import { types as sdkTypes } from '../../util/sdkLoader'

import css from './EditListingProductsForm.css'
import { SeasonalPricing } from './SeasonalPricing'

const { Money } = sdkTypes

const EditListingProductsProduct = (props) => {
  const {
    intl,
    disabled,
    fieldId,
    sectionTitle,
    form,
    product,
    onImageSubmit,
    onImageDelete,
    index
  } = props

  const bedTypeTitle = intl.formatMessage({ id: 'EditListingProductsForm.additionalProductBedTypeSelection' })
  const bathroomType = intl.formatMessage({ id: 'EditListingProductsForm.additionalProductBathroomTypeSelection' })
  const roomPhotos = intl.formatMessage({ id: 'EditListingProductsForm.additionalProductPhotosOfTheRoom' })

  const priceRequired = required(
    intl.formatMessage({
      id: 'EditListingPricingForm.priceRequired',
    })
  )
  const minPrice = new Money(config.listingMinimumPriceSubUnits, config.currency)
  const minPriceRequired = moneySubUnitAmountAtLeast(
    intl.formatMessage(
      { id: 'EditListingPricingForm.priceTooLow' },
      { minPrice: formatMoney(intl, minPrice) }
    ),
    config.listingMinimumPriceSubUnits
  )

  const priceType = _.get(form.getState(), `values.${fieldId}.pricing_type`, 'standard')

  const generatePricingStrategy = () => {
    return (
      priceType === 'standard'
        ? <FieldCurrencyInput
          id={`${fieldId}.price`}
          name={`${fieldId}.price`}
          disabled={disabled}
          label={intl.formatMessage({ id: 'EditListingProductsForm.additionalProductPriceSubTitle' })}
          placeholder={intl.formatMessage({ id: 'EditListingProductsForm.additionalProductPricePlaceholder' })}
          currencyConfig={config.currencyConfig}
          validate={priceValidators}
        />
        : <SeasonalPricing
          form={form}
          fieldId={fieldId}
          intl={intl}
        />
    )
  }

  const pricingHelpContent = () => (
    <div>
      <Typography variant="h6">Standard</Typography>
      <Typography paragraph style={{ fontFamily: 'Nunito Sans' }}>One nightly price is set for all seasons.</Typography>
      <Typography variant="h6">Seasonal</Typography>
      <Typography paragraph style={{ fontFamily: 'Nunito Sans' }}>A nightly price is chosen for each month of the year.</Typography>
      <Typography paragraph style={{ fontFamily: 'Nunito Sans' }}>If you choose seasonal pricing and a booking spans multiple months that have different pricing, the total price will account for the different per night prices. For example, if a guest books a stay from January 20 to February 10 the price will be 10 nights at the January price and 10 nights at the February price.</Typography>
    </div>
  )

  const losDiscountHelpContent = () => (
    <div>
      <Typography variant="h6">Length of Stay Discounts</Typography>
      <Typography paragraph style={{ fontFamily: 'Nunito Sans' }}>Click 'Add Discount' to enter discounts for bookings of a certain length or greater.</Typography>
      <Typography paragraph style={{ fontFamily: 'Nunito Sans' }}>The discounts you select here are only applied to this room.</Typography>
    </div>
  )

  const priceValidators = config.listingMinimumPriceSubUnits
    ? composeValidators(priceRequired, minPriceRequired)
    : priceRequired

  const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    paper: {
      height: 140,
      width: 100,
    },
    control: {
      padding: theme.spacing(2),
    },
  }))

  const classes = useStyles()

  return (
    <Paper style={{ padding: 20 }}>
      <Grid container className={classes.root} direction="column" spacing={5}>
        <Grid item xs={12}>
          <Grid container justify="center" spacing={2} direction="column">
            <Grid item xs={12}>
              <FieldTextInput
                id={`${fieldId}.type`}
                name={`${fieldId}.type`}
                disabled={disabled}
                type="text"
                label={intl.formatMessage({ id: 'EditListingProductsForm.additionalProductTypeTitle' })}
                placeholder={intl.formatMessage({ id: 'EditListingProductsForm.additionalProductTypePlaceholder' })}
                validate={required(intl.formatMessage({ id: 'EditListingProductsForm.additionalProductTypeInvalid' }))}
              />
            </Grid>
            <Grid item xs={12}>
              <FieldTextInput
                id={`${fieldId}.description`}
                name={`${fieldId}.description`}
                disabled={disabled}
                type="textarea"
                label={intl.formatMessage({ id: 'EditListingProductsForm.additionalProductDescriptionTitle' })}
                placeholder={intl.formatMessage({ id: 'EditListingProductsForm.additionalProductDescriptionPlaceholder' })}
                validate={required(intl.formatMessage({ id: 'GenericForm.required' }))}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <Grid container justify="center" spacing={2} direction="column">
            <Grid item xs={12}>
              <h3 className={css.subTitle}>Type of room</h3>
              <Field
                id={`${fieldId}.occupancyType`}
                name={`${fieldId}.occupancyType`}
                component={FieldReactSelect}
                disabled={disabled}
                validate={required(intl.formatMessage({ id: 'GenericForm.required' }))}
                options={[
                  {
                    value: 'private',
                    label: 'Private Room'
                  },
                  {
                    value: 'shared',
                    label: 'Shared Room'
                  }
                ]}
              />
            </Grid>
            <Grid item xs={12}>
              <h3 className={css.subTitle}>{bedTypeTitle}</h3>
              <Field
                id={`${fieldId}.beds`}
                name={`${fieldId}.beds`}
                component={FieldReactSelect}
                disabled={disabled}
                validate={required(intl.formatMessage({ id: 'GenericForm.required' }))}
                options={[
                  {
                    value: 'one-queen',
                    label: '1 Queen Bed'
                  },
                  {
                    value: 'two-queens',
                    label: '2 Queen Beds'
                  },
                  {
                    value: 'king',
                    label: '1 King Bed'
                  },
                  {
                    value: 'single-twin',
                    label: '1 Twin Bed'
                  },
                  {
                    value: 'double-twins',
                    label: '2 Twin Beds'
                  },
                  {
                    value: 'dorm',
                    label: 'Dorm'
                  }
                ]}
              />
            </Grid>
            <Grid item xs={12}>
              <h3 className={css.subTitle}>{bathroomType}</h3>
              <Field
                id={`${fieldId}.bathroom`}
                name={`${fieldId}.bathroom`}
                component={FieldReactSelect}
                disabled={disabled}
                validate={required(intl.formatMessage({ id: 'GenericForm.required' }))}
                options={[
                  {
                    value: 'private',
                    label: 'Private Bathroom'
                  },
                  {
                    value: 'shared',
                    label: 'Shared Bathroom'
                  }
                ]}
              />
            </Grid>
            <Grid item xs={12}>
              <h3 className={css.subTitle}>{intl.formatMessage({ id: 'EditListingProductsForm.additionalProductQuantity' })}</h3>
              <Field
                id={`${fieldId}.quantityAvailable`}
                name={`${fieldId}.quantityAvailable`}
                component={FieldReactSelect}
                validate={required(intl.formatMessage({ id: 'GenericForm.required' }))}
                disabled={disabled}
                options={[
                  {
                    value: 1,
                    label: '1'
                  },
                  {
                    value: 2,
                    label: '2'
                  },
                  {
                    value: 3,
                    label: '3'
                  },
                  {
                    value: 4,
                    label: '4'
                  },
                  {
                    value: 5,
                    label: '5'
                  },
                  {
                    value: 6,
                    label: '6'
                  },
                  {
                    value: 7,
                    label: '7'
                  },
                  {
                    value: 8,
                    label: '8'
                  }
                ]}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <Grid container justify="center" spacing={2} direction="column">
            <Grid item xs={12}>
              <Grid container alignItems="center" justify="flex-start">
                <Grid item>
                  <h3 className={css.subTitle}>Price</h3>
                </Grid>
                <Grid item>
                  <MPopover content={pricingHelpContent()}/>
                </Grid>
              </Grid>
              <MRadioGroup
                options={[
                  {
                    value: 'standard',
                    label: 'Standard'
                  },
                  {
                    value: 'seasonal',
                    label: 'Seasonal'
                  }
                ]}
                label={'Price'}
                form={form}
                defaultValue={priceType}
                name={`${fieldId}.pricing_type`}
              />
            </Grid>
            <Grid item xs={12}>
              {generatePricingStrategy()}
            </Grid>
            <Grid item xs={12}>
              <Grid container justify="center" spacing={2} direction="column">
                <Grid item xs={12}>
                  <Grid container alignItems="center" justify="flex-start">
                    <Grid item>
                      <h3 className={css.subTitle}>Length of stay discount</h3>
                    </Grid>
                    <Grid item>
                      <MPopover content={losDiscountHelpContent()}/>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <FieldArray id={`${fieldId}.losDiscount`} name={`${fieldId}.losDiscount`}>
                    {({ fields }) => fields.map((name, index) => {
                      return (
                        <div key={name}>
                          <Grid container justify={'space-between'} alignItems={'center'} direction="row" spacing={3}>
                            <Grid item xs={4}>
                              <MField
                                label={'Days'}
                                name={`${fieldId}.losDiscount.${index}.days`}
                                form={form}
                              />
                            </Grid>
                            <Grid item xs={4}>
                              <MField
                                label={'Discount'}
                                name={`${fieldId}.losDiscount.${index}.percent`}
                                form={form}
                                adornmentEnd={'%'}
                              />
                            </Grid>
                            <Grid item xs={2}>
                              <Tooltip title="Delete" aria-label="delete">
                                <IconButton
                                  aria-label="delete"
                                  onClick={() => fields.remove(index)}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Grid>
                          </Grid>
                        </div>
                      )
                    })}
                  </FieldArray>
                </Grid>
                <Grid item xs={12}>
                  <MButton
                    label={'Add Discount'}
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    startIcon={<AddIcon />}
                    onClick={() => form.mutators.push(`${fieldId}.losDiscount`)}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <Grid container justify="center" spacing={2} direction="column">
            <Grid item xs={12}>
              <h3 className={css.subTitle}>{roomPhotos}</h3>
              <SelectImage
                onUpload={(photoIds) => {
                  onImageSubmit(photoIds, product.id)
                }}
                onDelete={(photoIds) => {
                  onImageDelete(photoIds, product.id)
                }}
                disabled={form.getState().invalid}
                imagesToDisplay={_.keys(product.photos)}
                showThumbnails={true}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  )
}

EditListingProductsProduct.defaultProps = {
  disabled: false,
  fieldId: null,
  sectionTitle: null
}

EditListingProductsProduct.propTypes = {
  disabled: bool,
  fieldId: string,
  intl: intlShape.isRequired,
  sectionTitle: node
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateListingAdHoc: (update) => dispatch(updateListingAdHoc(update))
  }
}

export default connect(null, mapDispatchToProps)(EditListingProductsProduct)
